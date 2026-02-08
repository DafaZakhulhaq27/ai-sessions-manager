
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { Session } from '../../domain/entities/Session';

export class CreateSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) { }

    async execute(title: string): Promise<Session> {
        const session = Session.create(title);
        await this.sessionRepository.save(session);
        return session;
    }
}
