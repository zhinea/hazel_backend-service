import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Record } from './entities/Record';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'record_db',
  synchronize: true,
  logging: false,
  entities: [User, Record],
  migrations: [],
  subscribers: [],
  ssl:true
});
