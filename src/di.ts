
import { DrizzleSessionRepository } from './infrastructure/repositories/DrizzleSessionRepository';
import { GeminiAIService } from './infrastructure/services/GeminiAIService';
import { CreateSessionUseCase } from './application/use-cases/CreateSession';
import { GetSessionUseCase } from './application/use-cases/GetSession';
import { GetSessionListUseCase } from './application/use-cases/GetSessionList';
import { SendMessageUseCase } from './application/use-cases/SendMessage';

// Singleton instances (for simplicity in this Next.js app)
// In a refined setup, we might use a DI container or per-request scope if needed.

const sessionRepository = new DrizzleSessionRepository();
const aiService = new GeminiAIService();

export const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
export const getSessionUseCase = new GetSessionUseCase(sessionRepository);
export const getSessionListUseCase = new GetSessionListUseCase(sessionRepository);
export const sendMessageUseCase = new SendMessageUseCase(sessionRepository, aiService);
