import * as path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, '.env') });

import {Hono} from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { AppDataSource } from './data-source';
import {AuthController} from "./controllers/auth/AuthController.ts";
import { oidcAuthMiddleware, getAuth } from '@hono/oidc-auth'
import { ManagementClient } from 'auth0';
import {AuthenticateMiddleware} from "./middleware/authenticate.middleware.ts";
import recordRoute from "./routes/records.route.ts";
import {AIController} from "./controllers/AIController.ts";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {rateLimiter, type Store} from "hono-rate-limiter";
import MemoryStore from 'precise-memory-rate-limit'

const auth0Issuer = String(process.env.OIDC_ISSUER);
const auth0 = new ManagementClient({
    domain: auth0Issuer?.startsWith('https://') ? auth0Issuer.replace('https://', '') : auth0Issuer,
    clientId: String(process.env.OIDC_CLIENT_ID),
    clientSecret: String(process.env.OIDC_CLIENT_SECRET)
});
const app = new Hono();

// Configure CORS   
app.use('*', cors());

// Initialize TypeORM
AppDataSource.initialize()
    .then(() => console.log('Database connected'))
    .catch((error) => console.error('Database connection failed:', error));

// Controllers
const authController = new AuthController();
const aiController = new AIController();

app.use(
    rateLimiter({
        windowMs: 1 * 60 * 1000, // 1 minutes
        limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        // standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        keyGenerator: (c) => "<unique_key>", // Method to generate custom identifiers for clients.
        // store: ... , // Redis, MemoryStore, etc. See below.
        store: new MemoryStore() as unknown as Store,
    })
);

app.get('/auth/callback', authController.callback)
app.get('/logout', authController.logout)


app.use('*', oidcAuthMiddleware())
app.use('*', async (c, next) => {
    c.set('auth0', auth0)
    await next();
})
app.use('*', AuthenticateMiddleware)


app.get('/me', authController.me);
app.get('/good-bye', async (c) => {
    return c.html(`Thank you for using Hazel. You can close this window now :)<br/><br/> We hope you enjoyed your time with us. If you have any questions or feedback, please don't hesitate to reach out to us at <a href="mailto:support@flowless.my.id">support@flowless.my.id</a>.`)
})

app.route('/records', recordRoute);

app.post('/v1/ai/faker', zValidator('json', z.object({
    name: z.string().max(100).optional(),
    prompt: z.string().max(200),
    temperature: z.number().optional().default(1),
    top_p: z.number().optional().default(1),
})), (c) => aiController.generateCompletion(c))

const PORT = process.env.PORT || 3000;
serve({
    fetch: app.fetch,
    port: PORT
}, () => {
    console.log(`Server running on port ${PORT}`);
});