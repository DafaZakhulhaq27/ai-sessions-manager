
export type MessageRole = 'user' | 'assistant';

export class Message {
    constructor(
        public readonly id: string,
        public readonly sessionId: string,
        public readonly content: string,
        public readonly role: MessageRole,
        public readonly createdAt: Date
    ) { }

    static create(sessionId: string, content: string, role: MessageRole): Message {
        return new Message(
            crypto.randomUUID(),
            sessionId,
            content,
            role,
            new Date()
        );
    }

    static restore(
        id: string,
        sessionId: string,
        content: string,
        role: MessageRole,
        createdAt: Date
    ): Message {
        return new Message(id, sessionId, content, role, createdAt);
    }
}
