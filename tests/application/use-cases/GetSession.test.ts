
import { GetSessionUseCase } from '../../../src/application/use-cases/GetSession';
import { ISessionRepository } from '../../../src/domain/repositories/ISessionRepository';
import { Session } from '../../../src/domain/entities/Session';
import { Message } from '../../../src/domain/entities/Message';

describe('GetSessionUseCase', () => {
    let getSessionUseCase: GetSessionUseCase;
    let mockSessionRepository: jest.Mocked<ISessionRepository>;

    beforeEach(() => {
        mockSessionRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };

        getSessionUseCase = new GetSessionUseCase(mockSessionRepository);
    });

    it('should return a session with messages if it exists', async () => {
        const sessionId = 'session-123';
        const session = Session.create('Test Session');
        (session as any).id = sessionId;

        // Add some messages
        session.addMessage(Message.create(sessionId, 'User Hello', 'user'));
        session.addMessage(Message.create(sessionId, 'AI Hello', 'assistant'));

        mockSessionRepository.findById.mockResolvedValue(session);

        const result = await getSessionUseCase.execute(sessionId);

        expect(mockSessionRepository.findById).toHaveBeenCalledWith(sessionId);
        expect(result).toBe(session);
        expect(result?.messages.length).toBe(2);
        expect(result?.messages[0].content).toBe('User Hello');
    });

    it('should return null if session does not exist', async () => {
        mockSessionRepository.findById.mockResolvedValue(null);

        const result = await getSessionUseCase.execute('non-existent-id');

        expect(mockSessionRepository.findById).toHaveBeenCalledWith('non-existent-id');
        expect(result).toBeNull();
    });
});
