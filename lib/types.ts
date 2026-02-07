export interface Message {
    id: string;
    sessionId: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: Date;
}

export interface Session {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSessionRequest {
    title: string;
}

export interface CreateMessageRequest {
    content: string;
    role: 'user' | 'assistant';
}

export interface AIChatRequest {
    messages: Message[];
}

export interface AIChatResponse {
    response: string;
}