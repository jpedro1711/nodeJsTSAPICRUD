import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'crud_app',
  port: parseInt(process.env.DB_PORT || '5432'),
});