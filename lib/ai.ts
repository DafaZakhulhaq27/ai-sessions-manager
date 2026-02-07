import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        if (!process.env.GOOGLE_AI_API_KEY) {
            throw new Error('GOOGLE_AI_API_KEY is not set');
        }

        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateResponse(messages: Message[]): Promise<string> {
        try {
            // Simulate API delay
            await this.simulateDelay(1000, 3000);

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

    private simulateDelay(min: number, max: number): Promise<void> {
        const delay = Math.random() * (max - min) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

export const geminiService = new GeminiService();