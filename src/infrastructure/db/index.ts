import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use DATABASE_URL for Supabase connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

// Create postgres pool
const pool = new Pool({
    connectionString,
});
export const db = drizzle(pool, { schema });