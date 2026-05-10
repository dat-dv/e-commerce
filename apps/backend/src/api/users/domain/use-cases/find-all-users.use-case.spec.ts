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

    const result = await useCase.execute(1, 10);

    expect(mockUsersRepository.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(expectedResult);
  });
});
