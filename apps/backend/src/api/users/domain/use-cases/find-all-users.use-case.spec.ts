import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersUseCase } from './find-all-users.use-case';
import { IUsersRepository } from '../entities/users.repository.interface';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
  let mockUsersRepository: {
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllUsersUseCase, { provide: IUsersRepository, useValue: mockUsersRepository }],
    }).compile();

    useCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call findAll with page and limit', async () => {
    const expectedResult = { data: [], meta: {} };
    mockUsersRepository.findAll.mockResolvedValue(expectedResult);

    const query = { page: 1, limit: 10 };
    const result = await useCase.execute(query);

    expect(mockUsersRepository.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(expectedResult);
  });
});
