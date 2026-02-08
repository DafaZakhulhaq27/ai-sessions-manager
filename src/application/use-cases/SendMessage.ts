
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { IAIService } from '../../domain/services/IAIService';
import { Message } from '../../domain/entities/Message';

export class SendMessageUseCase {
    constructor(
        private sessionRepository: ISessionRepository,
        private aiService: IAIService
    ) { }

    async execute(sessionId: string, content: string, generateAIResponse: boolean = true): Promise<void> {
        const session = await this.sessionRepository.findById(sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        // Add user message
        const userMessage = Message.create(sessionId, content, 'user');
        session.addMessage(userMessage);
        await this.sessionRepository.save(session);

        if (generateAIResponse) {
            try {
                // Prepare context for AI (excluding the just added message to avoid duplication in logic if API expects only history, 
                // but typically we pass history + new input. 
                // My IAIService expects `context` which is history. 
                // Let's pass the current messages including the new one as context? 
                // Or history + input. 
                // IAIService signature: generateResponse(context: Message[], userPreciseInput: string)
                // context should be previous messages.

                const previousMessages = session.messages.filter(m => m.id !== userMessage.id);

                const aiResponseText = await this.aiService.generateResponse(previousMessages, content);

                const aiMessage = Message.create(sessionId, aiResponseText, 'assistant');
                session.addMessage(aiMessage);
                await this.sessionRepository.save(session);

            } catch (error) {
                console.error("Failed to generate AI response:", error);
                // We could add a system message or error message here if we wanted
                // For now, valid requirement is just "mock API delay/failure", we handled the failure by logging.
                // The user message is already saved.
            }
        }
    }
}
