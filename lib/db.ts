import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Use absolute path for the database
const dbPath = path.resolve(process.cwd(), 'dev.db');
const sqlite = new Database(process.env.DATABASE_URL || dbPath);
export const db = drizzle(sqlite, { schema });