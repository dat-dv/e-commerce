import { Test, TestingModule } from '@nestjs/testing';
import { FindAllTagsUseCase } from './find-all-tags.use-case';
import { ITagsRepository } from '../entities/tags.repository.interface';

describe('FindAllTagsUseCase', () => {
  let useCase: FindAllTagsUseCase;

  const mockTagsRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllTagsUseCase, { provide: ITagsRepository, useValue: mockTagsRepository }],
    }).compile();

    useCase = module.get<FindAllTagsUseCase>(FindAllTagsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call findAll on repository', async () => {
    const expectedResult = { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    mockTagsRepository.findAll.mockResolvedValue(expectedResult);

    const result = await useCase.execute(1, 10);

    expect(result).toBe(expectedResult);
    expect(mockTagsRepository.findAll).toHaveBeenCalledWith(1, 10);
  });
});
