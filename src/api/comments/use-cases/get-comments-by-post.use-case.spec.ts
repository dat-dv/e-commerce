import { Test, TestingModule } from '@nestjs/testing';
import { GetCommentsByPostUseCase } from './get-comments-by-post.use-case';
import { ICommentsRepository } from '../domain/comments.repository.interface';

describe('GetCommentsByPostUseCase', () => {
  let useCase: GetCommentsByPostUseCase;

  const mockCommentsRepository = {
    getCommentsByPost: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [GetCommentsByPostUseCase, { provide: ICommentsRepository, useValue: mockCommentsRepository }],
    }).compile();

    useCase = module.get<GetCommentsByPostUseCase>(GetCommentsByPostUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call getCommentsByPost on repository', async () => {
    const expectedResult = { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    mockCommentsRepository.getCommentsByPost.mockResolvedValue(expectedResult);

    const result = await useCase.execute('post1', 1, 10);

    expect(result).toBe(expectedResult);
    expect(mockCommentsRepository.getCommentsByPost).toHaveBeenCalledWith('post1', 1, 10);
  });
});
