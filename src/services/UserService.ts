import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsers() {
        return this.userRepository.find();
    }

    async getUserById(id: string) {
        return this.userRepository.findOneBy({ id });
    }

    async createUser(userData: Partial<User>) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async updateUser(id: string, userData: Partial<User>) {
        await this.userRepository.update(id, userData);
        return this.userRepository.findOneBy({ id });
    }

    async deleteUser(id: string) {
        return this.userRepository.delete(id);
    }
}