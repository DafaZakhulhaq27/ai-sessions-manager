import { GeminiService, geminiService, createGeminiService } from '@/lib/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI module
const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
        text: jest.fn().mockReturnValue('Mock AI response')
    }
});

const mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent
});

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel
    }))
}));

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('GeminiService', () => {
    let service: GeminiService;

    beforeEach(() => {
        // Reset environment variables
        delete process.env.GOOGLE_AI_API_KEY;
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should throw an error when GOOGLE_AI_API_KEY is not set', () => {
            expect(() => new GeminiService()).toThrow('GOOGLE_AI_API_KEY is not set');
        });

        it('should initialize with mock mode when API key is "ytest"', () => {
            process.env.GOOGLE_AI_API_KEY = 'ytest';
            service = new GeminiService();
            expect(service).toBeDefined();
        });

        it('should initialize with real Gemini client when valid API key is provided', () => {
            process.env.GOOGLE_AI_API_KEY = 'valid-api-key';
            service = new GeminiService();
            expect(service).toBeDefined();
            expect(GoogleGenerativeAI).toHaveBeenCalledWith('valid-api-key');
        });
    });

    describe('generateResponse', () => {
        beforeEach(() => {
            process.env.GOOGLE_AI_API_KEY = 'valid-api-key';
            service = new GeminiService();
        });

        it('should generate a response for valid messages', async () => {
            const messages = [
                { role: 'user' as const, content: 'Hello, how are you?' }
            ];

            const response = await service.generateResponse(messages);
            expect(response).toBe('Mock AI response');
        });

        it('should handle multiple messages in conversation', async () => {
            // Mock Math.random to avoid random failures
            const originalRandom = Math.random;
            Math.random = jest.fn().mockReturnValue(0.5); // Value that won't trigger failure

            const messages = [
                { role: 'user' as const, content: 'Hello' },
                { role: 'assistant' as const, content: 'Hi there!' },
                { role: 'user' as const, content: 'How are you?' }
            ];

            const response = await service.generateResponse(messages);
            expect(response).toBe('Mock AI response');

            // Restore original Math.random
            Math.random = originalRandom;
        });

        it('should throw an error when API call fails', async () => {
            // Mock the generateContent to throw an error
            const mockModel = {
                generateContent: jest.fn().mockRejectedValue(new Error('API Error'))
            };

            // Override the model instance
            (service as unknown as { model: typeof mockModel }).model = mockModel;

            const messages = [
                { role: 'user' as const, content: 'Hello' }
            ];

            await expect(service.generateResponse(messages)).rejects.toThrow('Failed to generate AI response');
        });

        it('should handle simulated random failures', async () => {
            // Mock Math.random to always return a value that triggers failure
            const originalRandom = Math.random;
            Math.random = jest.fn().mockReturnValue(0.05); // Less than 0.1 to trigger failure

            const messages = [
                { role: 'user' as const, content: 'Hello' }
            ];

            await expect(service.generateResponse(messages)).rejects.toThrow('Failed to generate AI response');

            // Restore original Math.random
            Math.random = originalRandom;
        });
    });

    describe('Mock Mode', () => {
        beforeEach(() => {
            process.env.GOOGLE_AI_API_KEY = 'ytest';
            service = new GeminiService();
        });

        it('should generate appropriate mock response for greeting', async () => {
            const messages = [
                { role: 'user' as const, content: 'Hello there!' }
            ];

            const response = await service.generateResponse(messages);
            expect(response).toContain("Hello! I'm a mock AI assistant");
        });

        it('should generate appropriate mock response for "how are you"', async () => {
            const messages = [
                { role: 'user' as const, content: 'How are you doing today?' }
            ];

            const response = await service.generateResponse(messages);
            expect(response).toContain("I'm doing well, thank you for asking");
        });

        it('should generate appropriate mock response for goodbye', async () => {
            const messages = [
                { role: 'user' as const, content: 'Goodbye for now' }
            ];

            const response = await service.generateResponse(messages);
            expect(response).toContain("Goodbye! Have a great day");
        });

        it('should generate default mock response for other messages', async () => {
            const messages = [
                { role: 'user' as const, content: 'Tell me about quantum physics' }
            ];

            const response = await service.generateResponse(messages);
            expect(response).toContain("This is a mock response from the AI assistant");
        });

        it('should handle empty messages array', async () => {
            const messages: { role: 'user' | 'assistant'; content: string }[] = [];

            const response = await service.generateResponse(messages);
            expect(response).toContain("This is a mock response from the AI assistant");
        });
    });

    describe('Simulate Delay', () => {
        beforeEach(() => {
            process.env.GOOGLE_AI_API_KEY = 'valid-api-key';
            service = new GeminiService();
        });

        it('should add delay before generating response', async () => {
            const startTime = Date.now();

            const messages = [
                { role: 'user' as const, content: 'Hello' }
            ];

            await service.generateResponse(messages);

            const endTime = Date.now();
            const elapsedTime = endTime - startTime;

            // Should take at least 1 second (minimum delay)
            expect(elapsedTime).toBeGreaterThanOrEqual(1000);
        });
    });
});

describe('geminiService singleton', () => {
    beforeEach(() => {
        // Reset the singleton instance
        (geminiService as unknown as { geminiServiceInstance: GeminiService | null }).geminiServiceInstance = null;
        delete process.env.GOOGLE_AI_API_KEY;
    });

    it('should create a new instance when getInstance is called', () => {
        process.env.GOOGLE_AI_API_KEY = 'valid-api-key';
        const instance = geminiService.getInstance();
        expect(instance).toBeInstanceOf(GeminiService);
    });

    it('should return the same instance on subsequent calls', () => {
        process.env.GOOGLE_AI_API_KEY = 'valid-api-key';
        const instance1 = geminiService.getInstance();
        const instance2 = geminiService.getInstance();
        expect(instance1).toBe(instance2);
    });
});

describe('createGeminiService factory function', () => {
    beforeEach(() => {
        delete process.env.GOOGLE_AI_API_KEY;
    });

    it('should create a new instance each time', () => {
        process.env.GOOGLE_AI_API_KEY = 'valid-api-key';
        const instance1 = createGeminiService();
        const instance2 = createGeminiService();
        expect(instance1).not.toBe(instance2);
        expect(instance1).toBeInstanceOf(GeminiService);
        expect(instance2).toBeInstanceOf(GeminiService);
    });
});