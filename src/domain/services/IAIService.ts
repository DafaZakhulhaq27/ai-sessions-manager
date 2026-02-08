
import { Message } from '../entities/Message';

export interface IAIService {
    generateResponse(context: Message[], userPreciseInput: string): Promise<string>;
}
