import { Test, TestingModule } from '@nestjs/testing';
import { FindAllRolesUseCase } from './find-all-roles.use-case';
import { IRolesRepository } from '../entities/roles.repository.interface';

describe('FindAllRolesUseCase', () => {
  let useCase: FindAllRolesUseCase;

  const mockRolesRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllRolesUseCase, { provide: IRolesRepository, useValue: mockRolesRepository }],
    }).compile();

    useCase = module.get<FindAllRolesUseCase>(FindAllRolesUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call findAll on repository', async () => {
    const expectedResult = { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    mockRolesRepository.findAll.mockResolvedValue(expectedResult);

    const result = await useCase.execute(1, 10);

    expect(result).toBe(expectedResult);
    expect(mockRolesRepository.findAll).toHaveBeenCalledWith(1, 10);
  });
});
