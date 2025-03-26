import type {Context} from 'hono';
import { RecordService } from '../services/RecordService';

export class RecordController {
    private recordService = new RecordService();

    async getAllRecords(context: Context) {
        try {
            const records = await this.recordService.getAllRecords();
            return context.json(records);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }

    async createRecord(context: Context) {
        try {
            const body = await context.req.json();
            const record = await this.recordService.createRecord(body);
            return context.json(record, 201);
        } catch (error) {
            return context.json({ error: error.message }, 400);
        }
    }

    async getRecord(context: Context) {
        try {
            const id = context.req.param('id');
            const record = await this.recordService.getRecordById(id);
            return record
                ? context.json(record)
                : context.json({ error: 'Record not found' }, 404);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }

    async updateRecord(context: Context) {
        try {
            const id = context.req.param('id');
            const body = await context.req.json();
            const record = await this.recordService.updateRecord(id, body);
            return record
                ? context.json(record)
                : context.json({ error: 'Record not found' }, 404);
        } catch (error) {
            return context.json({ error: error.message }, 400);
        }
    }

    async deleteRecord(context: Context) {
        try {
            const id = context.req.param('id');
            await this.recordService.deleteRecord(id);
            return context.body(null, 204);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }
}