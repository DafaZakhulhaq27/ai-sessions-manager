
import { db } from '../db';
import { sessions, messages } from '../db/schema';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { Session } from '../../domain/entities/Session';
import { Message } from '../../domain/entities/Message';
import { eq, desc } from 'drizzle-orm';

export class DrizzleSessionRepository implements ISessionRepository {
    async save(session: Session): Promise<void> {
        // Check if session exists
        const existing = await db.select().from(sessions).where(eq(sessions.id, session.id)).get();

        if (existing) {
            await db.update(sessions).set({
                title: session.title,
                updatedAt: session.updatedAt
            }).where(eq(sessions.id, session.id));
        } else {
            await db.insert(sessions).values({
                id: session.id,
                title: session.title,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt
            });
        }

        // simplistic approach: save all messages that are new
        // In a real app, we might valid checking existence or useupsert
        // For now, let's just insert messages that don't exist
        for (const msg of session.messages) {
            const existingMsg = await db.select().from(messages).where(eq(messages.id, msg.id)).get();
            if (!existingMsg) {
                await db.insert(messages).values({
                    id: msg.id,
                    sessionId: session.id,
                    content: msg.content,
                    role: msg.role,
                    createdAt: msg.createdAt
                });
            }
        }
    }

    async findById(id: string): Promise<Session | null> {
        const sessionRecord = await db.select().from(sessions).where(eq(sessions.id, id)).get();
        if (!sessionRecord) return null;

        const messageRecords = await db.select()
            .from(messages)
            .where(eq(messages.sessionId, id))
            .orderBy(messages.createdAt);

        const domainMessages = messageRecords.map(m =>
            Message.restore(m.id, m.sessionId, m.content, m.role as 'user' | 'assistant', m.createdAt)
        );

        return Session.restore(
            sessionRecord.id,
            sessionRecord.title,
            sessionRecord.createdAt,
            sessionRecord.updatedAt,
            domainMessages
        );
    }

    async findAll(): Promise<Session[]> {
        const sessionRecords = await db.select().from(sessions).orderBy(desc(sessions.updatedAt));

        // N+1 issue here potentially, but fine for small scale demo
        // Alternatively, could join but mapping back to aggregates is trickier without an invalid ORM mapping layer
        const sessionsList: Session[] = [];

        for (const record of sessionRecords) {
            // optimistically, we might not need messages for the list view
            // but the domain entity has them. 
            // For list view, we usually use a different ReadModel or DTO without loading all messages.
            // For simplicity here, let's load empty messages or verify if we need them.
            // The domain entity Session HAS messages. 
            // Let's load them to be correct, or change Session to not strictly require them loaded if we use lazy loading (not easily done here).
            // Let's just load them for now.
            const messageRecords = await db.select()
                .from(messages)
                .where(eq(messages.sessionId, record.id))
                .orderBy(messages.createdAt);

            const domainMessages = messageRecords.map(m =>
                Message.restore(m.id, m.sessionId, m.content, m.role as 'user' | 'assistant', m.createdAt)
            );

            sessionsList.push(Session.restore(
                record.id,
                record.title,
                record.createdAt,
                record.updatedAt,
                domainMessages
            ));
        }

        return sessionsList;
    }

    async delete(id: string): Promise<void> {
        await db.delete(sessions).where(eq(sessions.id, id));
    }
}
