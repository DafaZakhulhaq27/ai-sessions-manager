import { geminiService } from '@/lib/ai';
import { NextRequest } from 'next/server';

// Mock the geminiService
jest.mock('@/lib/ai', () => ({
    geminiService: {
        getInstance: jest.fn()
    }
}));

// Mock Next.js server components
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((body, init) => ({
            status: init?.status || 200,
            json: async () => body
        }))
    }
}));

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('/api/ai/chat/route', () => {
    let mockGeminiService: {
        getInstance: jest.Mock
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Set up the mocked geminiService
        mockGeminiService = geminiService as {
            getInstance: jest.Mock
        };
    });

    it('should return a successful response with AI-generated text', async () => {
        const mockMessages = [
            { role: 'user', content: 'Hello, how are you?' }
        ];
        const mockResponse = 'I am doing well, thank you for asking!';

        // Mock the geminiService.getInstance().generateResponse method
        const mockGenerateResponse = jest.fn().mockResolvedValue(mockResponse);
        mockGeminiService.getInstance.mockReturnValue({
            generateResponse: mockGenerateResponse
        } as unknown);

        // Create a mock request object
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ messages: mockMessages })
        };

        // Import the route function after mocking
        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({ response: mockResponse });
        expect(mockGenerateResponse).toHaveBeenCalledWith(mockMessages);
    });

    it('should return a 400 error when messages array is not provided', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({})
        };

        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: 'Messages array is required' });
    });

    it('should return a 400 error when messages is not an array', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ messages: 'not an array' })
        };

        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: 'Messages array is required' });
    });

    it('should return a 500 error when AI service fails', async () => {
        const mockMessages = [
            { role: 'user', content: 'Hello, how are you?' }
        ];

        // Mock the geminiService to throw an error
        const mockGenerateResponse = jest.fn().mockRejectedValue(new Error('AI service error'));
        mockGeminiService.getInstance.mockReturnValue({
            generateResponse: mockGenerateResponse
        } as unknown);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ messages: mockMessages })
        };

        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data).toEqual({ error: 'Failed to generate AI response' });
        expect(console.error).toHaveBeenCalledWith('Error in AI chat API:', expect.any(Error));
    });

    it('should handle empty messages array', async () => {
        const mockMessages: { role: string; content: string }[] = [];
        const mockResponse = 'Hello! How can I help you today?';

        const mockGenerateResponse = jest.fn().mockResolvedValue(mockResponse);
        mockGeminiService.getInstance.mockReturnValue({
            generateResponse: mockGenerateResponse
        } as unknown);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ messages: mockMessages })
        };

        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({ response: mockResponse });
        expect(mockGenerateResponse).toHaveBeenCalledWith(mockMessages);
    });

    it('should handle multiple messages in conversation', async () => {
        const mockMessages = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you?' }
        ];
        const mockResponse = 'I am doing well, thank you for asking!';

        const mockGenerateResponse = jest.fn().mockResolvedValue(mockResponse);
        mockGeminiService.getInstance.mockReturnValue({
            generateResponse: mockGenerateResponse
        } as unknown);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ messages: mockMessages })
        };

        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({ response: mockResponse });
        expect(mockGenerateResponse).toHaveBeenCalledWith(mockMessages);
    });

    it('should handle JSON parsing errors', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
        };

        const { POST } = await import('@/app/api/ai/chat/route');
        const response = await POST(mockRequest as unknown as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data).toEqual({ error: 'Failed to generate AI response' });
        expect(console.error).toHaveBeenCalledWith('Error in AI chat API:', expect.any(Error));
    });
});