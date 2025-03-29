import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation} from 'typeorm';
import type {arrayOutputType} from "zod";

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
    events: Array<any>;

    @Column('json')
    settings: Object;
}