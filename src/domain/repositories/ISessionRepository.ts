
import { Session } from '../entities/Session';

export interface ISessionRepository {
    save(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    findAll(): Promise<Session[]>;
    delete(id: string): Promise<void>;
}
