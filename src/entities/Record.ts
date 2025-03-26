import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation} from 'typeorm';
import { User } from './User';

@Entity({
    name: 'records'
})
export class Record {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    name: string;

    @Column({ type: 'timestamptz' })
    timestamp: Date;

    @Column()
    tabUrl: string;

    @Column('json')
    events: object;
}