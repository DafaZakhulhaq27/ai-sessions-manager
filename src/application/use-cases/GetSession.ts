
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { Session } from '../../domain/entities/Session';

export class GetSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) { }

    async execute(id: string): Promise<Session | null> {
        return await this.sessionRepository.findById(id);
    }
}
