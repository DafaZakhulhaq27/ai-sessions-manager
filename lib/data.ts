import { db } from './db';
import { sessions, messages } from './schema';
import { eq } from 'drizzle-orm';

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
    const id = crypto.randomUUID();
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
    const id = crypto.randomUUID();
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