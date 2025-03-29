import { Hono } from "hono";
import { RecordController } from "../controllers/RecordController.ts";

const recordRoute = new Hono();
const recordController = new RecordController();

// Authentication middleware for records routes
const requireAuth = async (c, next) => {
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Authentication required' }, 401);
    }
    await next();
};

// Apply auth middleware to all record routes
recordRoute.use('*', requireAuth);

// Record routes
recordRoute.get('/', (c) => recordController.getAllRecords(c));
recordRoute.post('/', (c) => recordController.createRecord(c));
recordRoute.post('/:id/events', (c) => recordController.addRecordEvent(c));
recordRoute.get('/:id', (c) => recordController.getRecord(c));
recordRoute.put('/:id', (c) => recordController.updateRecord(c));
recordRoute.delete('/:id', (c) => recordController.deleteRecord(c));

export default recordRoute;