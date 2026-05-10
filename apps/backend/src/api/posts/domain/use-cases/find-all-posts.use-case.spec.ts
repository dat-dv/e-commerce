import { Test, TestingModule } from '@nestjs/testing';
import { FindAllPostsUseCase } from './find-all-posts.use-case';
import { IPostsRepository } from '../entities/posts.repository.interface';

describe('FindAllPostsUseCase', () => {
  let useCase: FindAllPostsUseCase;

  const mockPostsRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllPostsUseCase, { provide: IPostsRepository, useValue: mockPostsRepository }],
    }).compile();

    useCase = module.get<FindAllPostsUseCase>(FindAllPostsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call findAll on repository', async () => {
    const expectedResult = { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    mockPostsRepository.findAll.mockResolvedValue(expectedResult);

    const result = await useCase.execute(1, 10);

    expect(result).toBe(expectedResult);
    expect(mockPostsRepository.findAll).toHaveBeenCalledWith(1, 10);
  });
});
