
export interface MessageDTO {
    id: string;
    sessionId: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: Date;
}

export interface SessionDTO {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages?: MessageDTO[];
}
