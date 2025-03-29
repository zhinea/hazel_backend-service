import { z } from 'zod';

// Schema for record creation
export const recordSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    tabUrl: z.string().url('Invalid URL format'),
    events: z.array(z.any()),
    settings: z.record(z.string(), z.any()).or(z.array(z.any()))
});

// Schema for record update (all fields optional)
export const recordUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100).optional(),
    tabUrl: z.string().url('Invalid URL format').optional(),
    events: z.record(z.string(), z.any()).or(z.array(z.any())).optional(),
    settings: z.record(z.string(), z.any()).or(z.array(z.any()))
});

export const addRecordEventSchema = z.object({
    events: z.array(z.any()).min(1, 'At least one event is required')
})

// Types from schema
export type RecordInput = z.infer<typeof recordSchema>;
export type RecordUpdateInput = z.infer<typeof recordUpdateSchema>;
export type AddRecordEventInput = z.infer<typeof addRecordEventSchema>;