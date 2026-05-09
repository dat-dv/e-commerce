import { Test, TestingModule } from '@nestjs/testing';
import { FindAllPermissionsUseCase } from './find-all-permissions.use-case';
import { IPermissionsRepository } from '../domain/permissions.repository.interface';

describe('FindAllPermissionsUseCase', () => {
  let useCase: FindAllPermissionsUseCase;

  const mockPermissionsRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllPermissionsUseCase, { provide: IPermissionsRepository, useValue: mockPermissionsRepository }],
    }).compile();

    useCase = module.get<FindAllPermissionsUseCase>(FindAllPermissionsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call findAll on repository', async () => {
    const expectedResult = { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    mockPermissionsRepository.findAll.mockResolvedValue(expectedResult);

    const result = await useCase.execute(1, 10);

    expect(result).toBe(expectedResult);
    expect(mockPermissionsRepository.findAll).toHaveBeenCalledWith(1, 10);
  });
});
