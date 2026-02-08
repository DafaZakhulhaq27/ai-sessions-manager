import {
    getSessions,
    getSession,
    getMessages,
    createSession,
    createMessage,
    updateSession,
    deleteSession,
    deleteMessage,
    getSessionWithMessages,
    getMessage,
    updateMessage,
    deleteMessagesBySessionId,
    getSessionCount,
    getMessageCount,
    getRecentSessions,
    searchSessions,
    searchMessages
} from '@/lib/data';

// Mock the database module
jest.mock('@/lib/db', () => ({
    db: {
        select: jest.fn(),
        from: jest.fn(),
        where: jest.fn(),
        orderBy: jest.fn(),
        limit: jest.fn(),
        insert: jest.fn(),
        values: jest.fn(),
        update: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
    }
}));

// Get the mocked db instance
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { db } = require('@/lib/db');

describe('Data Access Layer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Session Functions', () => {
        it('getSessions should be defined', () => {
            expect(getSessions).toBeDefined();
            expect(typeof getSessions).toBe('function');
        });

        it('getSession should be defined', () => {
            expect(getSession).toBeDefined();
            expect(typeof getSession).toBe('function');
        });

        it('createSession should be defined', () => {
            expect(createSession).toBeDefined();
            expect(typeof createSession).toBe('function');
        });

        it('updateSession should be defined', () => {
            expect(updateSession).toBeDefined();
            expect(typeof updateSession).toBe('function');
        });

        it('deleteSession should be defined', () => {
            expect(deleteSession).toBeDefined();
            expect(typeof deleteSession).toBe('function');
        });
    });

    describe('Message Functions', () => {
        it('getMessages should be defined', () => {
            expect(getMessages).toBeDefined();
            expect(typeof getMessages).toBe('function');
        });

        it('getMessage should be defined', () => {
            expect(getMessage).toBeDefined();
            expect(typeof getMessage).toBe('function');
        });

        it('createMessage should be defined', () => {
            expect(createMessage).toBeDefined();
            expect(typeof createMessage).toBe('function');
        });

        it('updateMessage should be defined', () => {
            expect(updateMessage).toBeDefined();
            expect(typeof updateMessage).toBe('function');
        });

        it('deleteMessage should be defined', () => {
            expect(deleteMessage).toBeDefined();
            expect(typeof deleteMessage).toBe('function');
        });

        it('deleteMessagesBySessionId should be defined', () => {
            expect(deleteMessagesBySessionId).toBeDefined();
            expect(typeof deleteMessagesBySessionId).toBe('function');
        });
    });

    describe('Utility Functions', () => {
        it('getSessionWithMessages should be defined', () => {
            expect(getSessionWithMessages).toBeDefined();
            expect(typeof getSessionWithMessages).toBe('function');
        });

        it('getSessionCount should be defined', () => {
            expect(getSessionCount).toBeDefined();
            expect(typeof getSessionCount).toBe('function');
        });

        it('getMessageCount should be defined', () => {
            expect(getMessageCount).toBeDefined();
            expect(typeof getMessageCount).toBe('function');
        });

        it('getRecentSessions should be defined', () => {
            expect(getRecentSessions).toBeDefined();
            expect(typeof getRecentSessions).toBe('function');
        });

        it('searchSessions should be defined', () => {
            expect(searchSessions).toBeDefined();
            expect(typeof searchSessions).toBe('function');
        });

        it('searchMessages should be defined', () => {
            expect(searchMessages).toBeDefined();
            expect(typeof searchMessages).toBe('function');
        });
    });

    describe('Function Behavior', () => {
        it('createSession should generate an ID and timestamps', () => {
            // Mock the database insert to resolve immediately
            db.insert.mockReturnValue({
                values: jest.fn().mockResolvedValue(undefined)
            });

            const result = createSession('Test Session');

            return result.then(session => {
                expect(session.id).toBeDefined();
                expect(session.title).toBe('Test Session');
                expect(session.createdAt).toBeInstanceOf(Date);
                expect(session.updatedAt).toBeInstanceOf(Date);
            });
        });

        it('createMessage should generate an ID and timestamp', () => {
            // Mock the database insert to resolve immediately
            db.insert.mockReturnValue({
                values: jest.fn().mockResolvedValue(undefined)
            });

            const result = createMessage('session-1', 'Hello', 'user');

            return result.then(message => {
                expect(message.id).toBeDefined();
                expect(message.sessionId).toBe('session-1');
                expect(message.content).toBe('Hello');
                expect(message.role).toBe('user');
                expect(message.createdAt).toBeInstanceOf(Date);
            });
        });
    });
});