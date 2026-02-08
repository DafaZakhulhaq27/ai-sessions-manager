import { GeminiService } from '@/lib/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI class
jest.mock('@google/generative-ai');

describe('GeminiService', () => {
    let aiService: GeminiService;
    let mockGenerateContent: jest.Mock;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup process.env
        process.env.GOOGLE_AI_API_KEY = 'test-api-key';
        process.env.GOOGLE_AI_MODEL = 'test-model';

        // Setup mock for generateContent
        mockGenerateContent = jest.fn().mockResolvedValue({
            response: {
                text: () => 'Mocked AI response'
            }
        });

        // Mock implementation of getGenerativeModel
        (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
            getGenerativeModel: () => ({
                generateContent: mockGenerateContent
            })
        }));

        aiService = new GeminiService();
    });

    it('should be initialized with correct model', () => {
        expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
    });

    it('should generate a response correctly', async () => {
        const messages = [
            { role: 'user' as const, content: 'Hello' }
        ];

        const response = await aiService.generateResponse(messages);

        expect(response).toBe('Mocked AI response');
        expect(mockGenerateContent).toHaveBeenCalledWith(
            expect.stringContaining('user: Hello')
        );
    });

    it('should throw an error if API key is missing', () => {
        delete process.env.GOOGLE_AI_API_KEY;
        expect(() => new GeminiService()).toThrow('GOOGLE_AI_API_KEY is not set');
    });

    it('should handle API errors gracefully', async () => {
        // Mock console.error to keep the test output clean
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockGenerateContent.mockRejectedValue(new Error('API Error'));

        await expect(aiService.generateResponse([])).rejects.toThrow('Failed to generate AI response');

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
