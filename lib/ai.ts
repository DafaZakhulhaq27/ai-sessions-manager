import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export class GeminiService {
    private genAI: GoogleGenerativeAI | null;
    private model: GenerativeModel | null;

    constructor() {
        if (!process.env.GOOGLE_AI_API_KEY) {
            throw new Error('GOOGLE_AI_API_KEY is not set');
        }

        // Check if we're using a test/mock API key
        if (process.env.GOOGLE_AI_API_KEY === 'ytest') {
            this.genAI = null;
            this.model = null;
            return;
        }

        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateResponse(messages: Message[]): Promise<string> {
        try {
            // Simulate API delay
            await this.simulateDelay(1000, 3000);

            // Check if we're in mock mode
            if (!this.model) {
                return this.generateMockResponse(messages);
            }

            // Simulate random failures (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Simulated API failure');
            }

            const conversationHistory = messages
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');

            const prompt = `You are a helpful AI assistant. Continue the conversation:\n\n${conversationHistory}\n\nassistant:`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating AI response:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    private generateMockResponse(messages: Message[]): string {
        const lastMessage = messages[messages.length - 1];
        const userContent = lastMessage?.content.toLowerCase() || '';

        // Simple mock responses based on keywords
        if (userContent.includes('hello') || userContent.includes('hi')) {
            return "Hello! I'm a mock AI assistant. How can I help you today?";
        } else if (userContent.includes('how are you')) {
            return "I'm doing well, thank you for asking! I'm a mock AI assistant, so I'm always ready to help.";
        } else if (userContent.includes('bye') || userContent.includes('goodbye')) {
            return "Goodbye! Have a great day!";
        } else {
            return "This is a mock response from the AI assistant. In a real implementation, this would be a response from Google's Gemini AI model.";
        }
    }

    private simulateDelay(min: number, max: number): Promise<void> {
        const delay = Math.random() * (max - min) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

let geminiServiceInstance: GeminiService | null = null;

export const geminiService = {
    getInstance(): GeminiService {
        if (!geminiServiceInstance) {
            geminiServiceInstance = new GeminiService();
        }
        return geminiServiceInstance;
    }
};

// For backward compatibility, we can also export a function that creates a new instance
export const createGeminiService = () => new GeminiService();