import { AppDataSource } from '../data-source';
import { Record } from '../entities/Record';

export class RecordService {
    private recordRepository = AppDataSource.getRepository(Record);

    async getAllRecords(userId: string) {
        return this.recordRepository.find({
            where: { user_id: userId }
        });
    }

    async getRecordById(id: string, userId: string) {
        return this.recordRepository.findOne({
            where: {
                id,
                user_id: userId
            }
        });
    }

    async createRecord(recordData: {
        userId: string;
        name: string;
        tabUrl: string;
        events: object;
    }) {
        const record = this.recordRepository.create({
            ...recordData,
            user_id: recordData.userId,
            timestamp: new Date()
        });
        return this.recordRepository.save(record);
    }

    async updateRecord(id: string, userId: string, recordData: Partial<Record>) {
        // Check if record exists and belongs to the user
        const record = await this.recordRepository.findOne({
            where: {
                id,
                user_id: userId
            }
        });

        if (!record) throw new Error('Record not found or access denied');

        await this.recordRepository.update(id, recordData);
        return this.recordRepository.findOneBy({ id });
    }

    async deleteRecord(id: string, userId: string) {
        // Check if record exists and belongs to the user
        const record = await this.recordRepository.findOne({
            where: {
                id,
                user_id: userId
            }
        });

        if (!record) throw new Error('Record not found or access denied');

        return this.recordRepository.delete(id);
    }
}