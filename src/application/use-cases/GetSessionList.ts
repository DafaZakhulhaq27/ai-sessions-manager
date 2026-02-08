
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { Session } from '../../domain/entities/Session';

export class GetSessionListUseCase {
    constructor(private sessionRepository: ISessionRepository) { }

    async execute(): Promise<Session[]> {
        return await this.sessionRepository.findAll();
    }
}
