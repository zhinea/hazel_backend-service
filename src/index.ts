import {type Context, Hono, type Next} from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { AppDataSource } from './data-source';
import {AuthController} from "./controllers/auth/AuthController.ts";
import { oidcAuthMiddleware, getAuth } from '@hono/oidc-auth'
import { ManagementClient } from 'auth0';
import {AuthenticateMiddleware} from "./middleware/authenticate.middleware.ts";
import recordRoute from "./routes/records.route.ts";

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

app.get('/auth/callback', authController.callback)

app.use('*', oidcAuthMiddleware())
app.use('*', async (c, next) => {
    c.set('auth0', auth0)
    await next();
})
app.use('*', AuthenticateMiddleware)

app.get('/logout', authController.logout)

app.get('/me', authController.me);

app.route('/records', recordRoute);

const PORT = process.env.PORT || 3000;
serve({
    fetch: app.fetch,
    port: PORT
}, () => {
    console.log(`Server running on port ${PORT}`);
});