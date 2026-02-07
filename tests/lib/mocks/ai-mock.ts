import { GeminiService } from '@/lib/ai';

// Mock message type for testing
export interface MockMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Mock response type for testing
export interface MockAIResponse {
    response: string;
    error?: string;
}

// Mock GeminiService for testing
export class MockGeminiService extends GeminiService {
    private mockResponses: Map<string, string> = new Map();
    private shouldFail: boolean = false;
    private delayMs: number = 0;

    constructor() {
        // Initialize with test API key to use mock mode
        process.env.GOOGLE_AI_API_KEY = 'ytest';
        super();
    }

    // Set up custom mock responses
    setMockResponse(input: string, response: string): void {
        this.mockResponses.set(input.toLowerCase(), response);
    }

    // Set up the service to always fail
    setShouldFail(shouldFail: boolean): void {
        this.shouldFail = shouldFail;
    }

    // Set up artificial delay for testing
    setDelay(delayMs: number): void {
        this.delayMs = delayMs;
    }

    // Override generateResponse to use mock behavior
    async generateResponse(messages: MockMessage[]): Promise<string> {
        // Apply artificial delay if set
        if (this.delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, this.delayMs));
        }

        // Simulate failure if configured
        if (this.shouldFail) {
            throw new Error('Mock AI service failure');
        }

        // Get the last user message
        const lastUserMessage = messages
            .filter(msg => msg.role === 'user')
            .pop();

        if (!lastUserMessage) {
            return 'I need a user message to respond to.';
        }

        const content = lastUserMessage.content.toLowerCase();

        // Check for custom mock responses first
        if (this.mockResponses.has(content)) {
            return this.mockResponses.get(content)!;
        }

        // Fall back to default mock responses
        return this.generateDefaultMockResponse(content);
    }

    private generateDefaultMockResponse(content: string): string {
        if (content.includes('hello') || content.includes('hi')) {
            return "Hello! I'm a mock AI assistant. How can I help you today?";
        } else if (content.includes('how are you')) {
            return "I'm doing well, thank you for asking! I'm a mock AI assistant, so I'm always ready to help.";
        } else if (content.includes('bye') || content.includes('goodbye')) {
            return "Goodbye! Have a great day!";
        } else if (content.includes('weather')) {
            return "I'm a mock AI assistant and don't have access to real-time weather data. In a real implementation, I would check the weather for you.";
        } else if (content.includes('time')) {
            return "I'm a mock AI assistant and don't have access to the current time. In a real implementation, I would tell you the current time.";
        } else {
            return "This is a mock response from the AI assistant. In a real implementation, this would be a response from Google's Gemini AI model.";
        }
    }

    // Reset all mock configurations
    reset(): void {
        this.mockResponses.clear();
        this.shouldFail = false;
        this.delayMs = 0;
    }
}

// Factory function to create a mock service
export function createMockGeminiService(): MockGeminiService {
    return new MockGeminiService();
}

// Helper function to create test messages
export function createTestMessage(role: 'user' | 'assistant', content: string): MockMessage {
    return { role, content };
}

// Helper function to create a test conversation
export function createTestConversation(messages: Array<{ role: 'user' | 'assistant'; content: string }>): MockMessage[] {
    return messages.map(msg => createTestMessage(msg.role, msg.content));
}

// Pre-configured mock scenarios for testing
export const mockScenarios = {
    // Simple greeting scenario
    greeting: {
        messages: [
            createTestMessage('user', 'Hello there!')
        ],
        expectedResponse: "Hello! I'm a mock AI assistant. How can I help you today?"
    },

    // How are you scenario
    howAreYou: {
        messages: [
            createTestMessage('user', 'How are you doing today?')
        ],
        expectedResponse: "I'm doing well, thank you for asking! I'm a mock AI assistant, so I'm always ready to help."
    },

    // Goodbye scenario
    goodbye: {
        messages: [
            createTestMessage('user', 'Goodbye for now')
        ],
        expectedResponse: "Goodbye! Have a great day!"
    },

    // Weather question scenario
    weather: {
        messages: [
            createTestMessage('user', 'What is the weather like today?')
        ],
        expectedResponse: "I'm a mock AI assistant and don't have access to real-time weather data. In a real implementation, I would check the weather for you."
    },

    // Multi-turn conversation
    multiTurn: {
        messages: [
            createTestMessage('user', 'Hello'),
            createTestMessage('assistant', 'Hi there! How can I help you?'),
            createTestMessage('user', 'Can you tell me a joke?')
        ],
        expectedResponse: "This is a mock response from the AI assistant. In a real implementation, this would be a response from Google's Gemini AI model."
    },

    // Empty conversation
    empty: {
        messages: [],
        expectedResponse: "I need a user message to respond to."
    }
};

// Jest mock for the GeminiService
export const createJestMock = () => {
    const mockService = createMockGeminiService();

    return {
        getInstance: jest.fn(() => mockService),
        mockService
    };
};