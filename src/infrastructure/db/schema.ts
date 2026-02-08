import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    role: text('role').notNull(), // 'user' | 'assistant'
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;