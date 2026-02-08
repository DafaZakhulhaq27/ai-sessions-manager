
import { GetSessionListUseCase } from '../../../src/application/use-cases/GetSessionList';
import { ISessionRepository } from '../../../src/domain/repositories/ISessionRepository';
import { Session } from '../../../src/domain/entities/Session';

describe('GetSessionListUseCase', () => {
    let getSessionListUseCase: GetSessionListUseCase;
    let mockSessionRepository: jest.Mocked<ISessionRepository>;

    beforeEach(() => {
        mockSessionRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
        };

        getSessionListUseCase = new GetSessionListUseCase(mockSessionRepository);
    });

    it('should return a list of sessions', async () => {
        const session1 = Session.create('Session 1');
        const session2 = Session.create('Session 2');
        const sessions = [session1, session2];

        mockSessionRepository.findAll.mockResolvedValue(sessions);

        const result = await getSessionListUseCase.execute();

        expect(mockSessionRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(sessions);
        expect(result.length).toBe(2);
        expect(result[0].title).toBe('Session 1');
    });

    it('should return an empty list if no sessions exist', async () => {
        mockSessionRepository.findAll.mockResolvedValue([]);

        const result = await getSessionListUseCase.execute();

        expect(mockSessionRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });
});
