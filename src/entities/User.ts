import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique} from "typeorm";
import type {UserUsageAlloc} from "../types/user.ts";
import {AppDataSource} from "../data-source.ts";

@Entity({
    name: 'users'
})
export class User {

    @PrimaryColumn()
    id: string;

    @Column({
        type: 'numeric',
        default: 0
    })
    tier: number;

    @Column({
        type: 'jsonb',
        default: {
            ai_faker: {
                max: 100,
                current: 0,
                reset_period: 'day'
            }
        }
    })
    usage_alloc: UserUsageAlloc;
}
