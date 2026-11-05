import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Drama } from './dramas/entities/drama.entity.js';
import { CreateDrama1793679035307 } from './migrations/1793679035307-CreateDrama.js';

dotenv.config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Explicit references work both from `src` (ts-node) and `dist` (compiled).
    entities: [Drama],
    migrations: [CreateDrama1793679035307],
});
