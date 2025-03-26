import { AppDataSource } from '../data-source';
import { Record } from '../entities/Record';
import { User } from '../entities/User';

export class RecordService {
    private recordRepository = AppDataSource.getRepository(Record);
    private userRepository = AppDataSource.getRepository(User);

    async getAllRecords() {
        return this.recordRepository.find({ relations: ['user'] });
    }

    async getRecordById(id: string) {
        return this.recordRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    async createRecord(recordData: {
        userId: string;
        name: string;
        timestamp: Date;
        tabUrl: string;
        events: object;
    }) {
        const user = await this.userRepository.findOneBy({ id: recordData.userId });
        if (!user) throw new Error('User not found');

        const record = this.recordRepository.create({
            ...recordData,
            user,
        });
        return this.recordRepository.save(record);
    }

    async updateRecord(id: string, recordData: Partial<Record>) {
        await this.recordRepository.update(id, recordData);
        return this.recordRepository.findOneBy({ id });
    }

    async deleteRecord(id: string) {
        return this.recordRepository.delete(id);
    }
}