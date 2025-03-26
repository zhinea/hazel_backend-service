import {Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation} from 'typeorm';
import { Record } from './Record';

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @OneToMany(() => Record, (record) => record.user)
    records: Relation<Record>[];
}