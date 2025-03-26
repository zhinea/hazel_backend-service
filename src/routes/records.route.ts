import {Hono} from "hono";
import {RecordController} from "../controllers/RecordController.ts";

const recordRoute = new Hono();

const recordController = new RecordController();

// Record routes
recordRoute.get('/records', (c) => recordController.getAllRecords(c));
recordRoute.post('/records', (c) => recordController.createRecord(c));
recordRoute.get('/records/:id', (c) => recordController.getRecord(c));
recordRoute.put('/records/:id', (c) => recordController.updateRecord(c));
recordRoute.delete('/records/:id', (c) => recordController.deleteRecord(c));


export default recordRoute;