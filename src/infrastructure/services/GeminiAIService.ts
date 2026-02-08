
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from '../../domain/services/IAIService';
import { Message } from '../../domain/entities/Message';

export class GeminiAIService implements IAIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('GOOGLE_AI_API_KEY is not set');
        }
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        this.model = this.genAI.getGenerativeModel({ model: process.env.GOOGLE_AI_MODEL || 'gemini-flash-latest' });
    }

    async generateResponse(context: Message[], userPreciseInput: string): Promise<string> {
        try {
            const chatObj = this.model.startChat({
                history: context.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                })),
            });

            const result = await chatObj.sendMessage(userPreciseInput);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw error;
        }
    }
}
