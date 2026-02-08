import { db } from './db';
import { sessions, messages } from './schema';
import { eq, like, and } from 'drizzle-orm';

// Fallback ID generator for environments without crypto.randomUUID
function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function getSessions() {
    return await db.select().from(sessions).orderBy(sessions.updatedAt);
}

export async function getSession(id: string) {
    const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return result[0] || null;
}

export async function getMessages(sessionId: string) {
    return await db.select()
        .from(messages)
        .where(eq(messages.sessionId, sessionId))
        .orderBy(messages.createdAt);
}

export async function createSession(title: string) {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : generateId();
    const now = new Date();

    await db.insert(sessions).values({
        id,
        title,
        createdAt: now,
        updatedAt: now,
    });

    return { id, title, createdAt: now, updatedAt: now };
}

export async function createMessage(sessionId: string, content: string, role: 'user' | 'assistant') {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : generateId();
    const now = new Date();

    await db.insert(messages).values({
        id,
        sessionId,
        content,
        role,
        createdAt: now,
    });

    return { id, sessionId, content, role, createdAt: now };
}

export async function updateSession(id: string, title: string) {
    const now = new Date();

    await db
        .update(sessions)
        .set({
            title,
            updatedAt: now
        })
        .where(eq(sessions.id, id));

    return { id, title, updatedAt: now };
}

export async function deleteSession(id: string) {
    await db.delete(sessions).where(eq(sessions.id, id));
}

export async function deleteMessage(id: string) {
    await db.delete(messages).where(eq(messages.id, id));
}

export async function getSessionWithMessages(id: string) {
    const session = await getSession(id);
    if (!session) return null;

    const sessionMessages = await getMessages(id);

    return {
        ...session,
        messages: sessionMessages
    };
}

// Additional utility functions for enhanced data access

export async function getMessage(id: string) {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0] || null;
}

export async function updateMessage(id: string, content: string) {
    await db
        .update(messages)
        .set({ content })
        .where(eq(messages.id, id));

    return { id, content };
}

export async function deleteMessagesBySessionId(sessionId: string) {
    await db.delete(messages).where(eq(messages.sessionId, sessionId));
}

export async function getSessionCount() {
    const result = await db.select({ count: sessions.id }).from(sessions);
    return result.length;
}

export async function getMessageCount(sessionId?: string) {
    if (sessionId) {
        const result = await db.select({ count: messages.id }).from(messages).where(eq(messages.sessionId, sessionId));
        return result.length;
    } else {
        const result = await db.select({ count: messages.id }).from(messages);
        return result.length;
    }
}

export async function getRecentSessions(limit: number = 10) {
    return await db
        .select()
        .from(sessions)
        .orderBy(sessions.updatedAt)
        .limit(limit);
}

export async function searchSessions(query: string) {
    return await db
        .select()
        .from(sessions)
        .where(like(sessions.title, `%${query}%`))
        .orderBy(sessions.updatedAt);
}

export async function searchMessages(sessionId: string, query: string) {
    return await db
        .select()
        .from(messages)
        .where(
            and(
                eq(messages.sessionId, sessionId),
                like(messages.content, `%${query}%`)
            )
        )
        .orderBy(messages.createdAt);
}