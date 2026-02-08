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
        const modelName = process.env.GOOGLE_AI_MODEL || 'gemini-flash-latest';
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    async generateResponse(messages: Message[]): Promise<string> {
        try {
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