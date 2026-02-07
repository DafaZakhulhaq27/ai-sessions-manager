import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const messages = sqliteTable('messages', {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    role: text('role').notNull(), // 'user' | 'assistant'
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;