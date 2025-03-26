import type {Context} from 'hono';
import { RecordService } from '../services/RecordService';
import { recordSchema, recordUpdateSchema } from '../schema/record.schema';
import { ZodError } from 'zod';

export class RecordController {
    private recordService = new RecordService();

    async getAllRecords(context: Context) {
        try {
            const user = context.get('user');
            if (!user) {
                return context.json({ error: 'Authentication required' }, 401);
            }

            const records = await this.recordService.getAllRecords(user.user_id);
            return context.json(records);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }

    async createRecord(context: Context) {
        try {
            const user = context.get('user');
            if (!user) {
                return context.json({ error: 'Authentication required' }, 401);
            }

            const body = await context.req.json();

            // Validate with Zod
            try {
                const validatedData = recordSchema.parse(body);

                const record = await this.recordService.createRecord(Object.assign({}, validatedData, {
                    userId: user.user_id
                }));
                return context.json(record, 201);
            } catch (err) {
                if (err instanceof ZodError) {
                    return context.json({
                        error: 'Validation failed',
                        details: err.errors
                    }, 400);
                }
                throw err;
            }
        } catch (error) {
            return context.json({ error: error.message }, 400);
        }
    }

    async getRecord(context: Context) {
        try {
            const user = context.get('user');
            if (!user) {
                return context.json({ error: 'Authentication required' }, 401);
            }

            const id = context.req.param('id');
            const record = await this.recordService.getRecordById(id, user.user_id);
            return record
                ? context.json(record)
                : context.json({ error: 'Record not found' }, 404);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }

    async updateRecord(context: Context) {
        try {
            const user = context.get('user');
            if (!user) {
                return context.json({ error: 'Authentication required' }, 401);
            }

            const id = context.req.param('id');
            const body = await context.req.json();

            // Validate with Zod
            try {
                const validatedData = recordUpdateSchema.parse(body);
                const record = await this.recordService.updateRecord(id, user.user_id, validatedData);
                return record
                    ? context.json(record)
                    : context.json({ error: 'Record not found' }, 404);
            } catch (err) {
                if (err instanceof ZodError) {
                    return context.json({
                        error: 'Validation failed',
                        details: err.errors
                    }, 400);
                }
                throw err;
            }
        } catch (error) {
            return context.json({ error: error.message }, 400);
        }
    }

    async deleteRecord(context: Context) {
        try {
            const user = context.get('user');
            if (!user) {
                return context.json({ error: 'Authentication required' }, 401);
            }

            const id = context.req.param('id');
            await this.recordService.deleteRecord(id, user.user_id);
            return context.body(null, 204);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }
}