import {AppDataSource} from "../data-source.ts";
import {User} from "../entities/User.ts";
import type {UserUsaageAllocVariable} from "../types/user.ts";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async incrementAllocUsage(user: User, alloc_name: UserUsaageAllocVariable, count: number = 1){
        user.usage_alloc[alloc_name].current += count;
        await this.userRepository.upsert(user, {
            conflictPaths: ['id'],
            skipUpdateIfNoValuesChanged: true
        });

        return user;
    }
}