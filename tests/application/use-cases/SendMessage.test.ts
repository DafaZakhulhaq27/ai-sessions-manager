
import { SendMessageUseCase } from '../../../src/application/use-cases/SendMessage';
import { ISessionRepository } from '../../../src/domain/repositories/ISessionRepository';
import { IAIService } from '../../../src/domain/services/IAIService';
import { Session } from '../../../src/domain/entities/Session';

describe('SendMessageUseCase', () => {
    let sendMessageUseCase: SendMessageUseCase;
    let mockSessionRepository: jest.Mocked<ISessionRepository>;
    let mockAIService: jest.Mocked<IAIService>;

    beforeEach(() => {
        mockSessionRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };

        mockAIService = {
            generateResponse: jest.fn(),
        };

        sendMessageUseCase = new SendMessageUseCase(mockSessionRepository, mockAIService);
    });

    it('should add user message and generate AI response', async () => {
        const sessionId = 'session-123';
        const userContent = 'Hello AI';
        const aiResponse = 'Hello User';

        const existingSession = Session.create('Test Session');
        // Override id to match
        (existingSession as any).id = sessionId;

        mockSessionRepository.findById.mockResolvedValue(existingSession);
        mockAIService.generateResponse.mockResolvedValue(aiResponse);

        await sendMessageUseCase.execute(sessionId, userContent, true);

        // Verify user message added
        expect(existingSession.messages.length).toBe(2); // User + AI
        expect(existingSession.messages[0].content).toBe(userContent);
        expect(existingSession.messages[0].role).toBe('user');

        // Verify AI interaction
        expect(mockAIService.generateResponse).toHaveBeenCalledTimes(1);

        // Verify persistence (saved 2 times: once for user msg, once for ai msg)
        expect(mockSessionRepository.save).toHaveBeenCalledTimes(2);
        expect(mockSessionRepository.save).toHaveBeenCalledWith(existingSession);

        // Verify AI message added
        expect(existingSession.messages[1].content).toBe(aiResponse);
        expect(existingSession.messages[1].role).toBe('assistant');
    });

    it('should handle AI service failure gracefully', async () => {
        const sessionId = 'session-123';
        const userContent = 'Hello AI';

        const existingSession = Session.create('Test Session');
        (existingSession as any).id = sessionId;

        mockSessionRepository.findById.mockResolvedValue(existingSession);
        mockAIService.generateResponse.mockRejectedValue(new Error('AI Error'));

        await sendMessageUseCase.execute(sessionId, userContent, true);

        // Verify user message and error message added
        expect(existingSession.messages.length).toBe(2); // User + Error message
        expect(existingSession.messages[0].content).toBe(userContent);
        expect(existingSession.messages[0].role).toBe('user');

        // Verify error message was added
        expect(existingSession.messages[1].content).toBe("Sorry, I couldn't generate a response. Please try again later.");
        expect(existingSession.messages[1].role).toBe('assistant');

        // Verify persistence (saved twice: once for user msg, once for error msg)
        expect(mockSessionRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should throw error if session not found', async () => {
        mockSessionRepository.findById.mockResolvedValue(null);

        await expect(sendMessageUseCase.execute('invalid-id', 'hello')).rejects.toThrow('Session not found');
    });
});
