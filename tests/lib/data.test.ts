import * as data from '@/lib/data';
import { db } from '@/lib/db';
import { sessions, messages } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Mock the database
jest.mock('@/lib/db', () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}));

describe('Data Library', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSessions', () => {
        it('should return all sessions ordered by updatedAt', async () => {
            const mockSessions = [{ id: '1', title: 'Session 1' }];
            const mockOrderBy = jest.fn().mockResolvedValue(mockSessions);
            const mockFrom = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

            const result = await data.getSessions();

            expect(result).toEqual(mockSessions);
            expect(db.select).toHaveBeenCalled();
            expect(mockFrom).toHaveBeenCalledWith(sessions);
        });
    });

    describe('getSession', () => {
        it('should return a single session by id', async () => {
            const mockSession = { id: '1', title: 'Session 1' };
            const mockLimit = jest.fn().mockResolvedValue([mockSession]);
            const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

            const result = await data.getSession('1');

            expect(result).toEqual(mockSession);
            expect(mockWhere).toHaveBeenCalled();
        });

        it('should return null if session not found', async () => {
            const mockLimit = jest.fn().mockResolvedValue([]);
            const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

            const result = await data.getSession('non-existent');

            expect(result).toBeNull();
        });
    });

    describe('createSession', () => {
        it('should insert a new session and return it', async () => {
            const mockValues = jest.fn().mockResolvedValue({});
            (db.insert as jest.Mock).mockReturnValue({ values: mockValues });

            const title = 'New Session';
            const result = await data.createSession(title);

            expect(result.title).toBe(title);
            expect(result.id).toBeDefined();
            expect(db.insert).toHaveBeenCalledWith(sessions);
            expect(mockValues).toHaveBeenCalled();
        });
    });

    describe('createMessage', () => {
        it('should insert a new message and return it', async () => {
            const mockValues = jest.fn().mockResolvedValue({});
            (db.insert as jest.Mock).mockReturnValue({ values: mockValues });

            const sessionId = 'session-1';
            const content = 'Hello AI';
            const role = 'user';

            const result = await data.createMessage(sessionId, content, role);

            expect(result.sessionId).toBe(sessionId);
            expect(result.content).toBe(content);
            expect(result.role).toBe(role);
            expect(db.insert).toHaveBeenCalledWith(messages);
        });
    });

    describe('updateSession', () => {
        it('should update session title and return updated data', async () => {
            const mockWhere = jest.fn().mockResolvedValue({});
            const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
            (db.update as jest.Mock).mockReturnValue({ set: mockSet });

            const id = '1';
            const newTitle = 'Updated Title';
            const result = await data.updateSession(id, newTitle);

            expect(result.id).toBe(id);
            expect(result.title).toBe(newTitle);
            expect(db.update).toHaveBeenCalledWith(sessions);
            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ title: newTitle }));
        });
    });

    describe('getSessionWithMessages', () => {
        it('should return session with all its messages', async () => {
            const mockSession = { id: 's1', title: 'Session 1' };
            const mockMessages = [{ id: 'm1', sessionId: 's1', content: 'Hi' }];

            // Mock getSession
            const mockLimit = jest.fn().mockResolvedValue([mockSession]);
            const mockWhereS = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFromS = jest.fn().mockReturnValue({ where: mockWhereS });

            // Mock getMessages
            const mockOrderBy = jest.fn().mockResolvedValue(mockMessages);
            const mockWhereM = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFromM = jest.fn().mockReturnValue({ where: mockWhereM });

            (db.select as jest.Mock)
                .mockReturnValueOnce({ from: mockFromS }) // for getSession
                .mockReturnValueOnce({ from: mockFromM }); // for getMessages

            const result = await data.getSessionWithMessages('s1');

            expect(result).toEqual({ ...mockSession, messages: mockMessages });
        });

        it('should return null if session does not exist', async () => {
            const mockLimit = jest.fn().mockResolvedValue([]);
            const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

            const result = await data.getSessionWithMessages('none');

            expect(result).toBeNull();
        });
    });

    describe('searchSessions', () => {
        it('should return filtered sessions based on query', async () => {
            const mockSessions = [{ id: '1', title: 'Test result' }];
            const mockOrderBy = jest.fn().mockResolvedValue(mockSessions);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

            const result = await data.searchSessions('test');

            expect(result).toEqual(mockSessions);
        });
    });

    describe('deleteSession', () => {
        it('should delete a session by id', async () => {
            const mockWhere = jest.fn().mockResolvedValue({});
            (db.delete as jest.Mock).mockReturnValue({ where: mockWhere });

            await data.deleteSession('1');

            expect(db.delete).toHaveBeenCalledWith(sessions);
            expect(mockWhere).toHaveBeenCalled();
        });
    });

    describe('deleteMessage', () => {
        it('should delete a message by id', async () => {
            const mockWhere = jest.fn().mockResolvedValue({});
            (db.delete as jest.Mock).mockReturnValue({ where: mockWhere });

            await data.deleteMessage('101');

            expect(db.delete).toHaveBeenCalledWith(messages);
            expect(mockWhere).toHaveBeenCalled();
        });
    });
});
