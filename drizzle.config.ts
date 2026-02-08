import type { Config } from 'drizzle-kit';

export default {
    schema: './src/infrastructure/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_URL || './dev.db',
    },
    strict: true,
} satisfies Config;