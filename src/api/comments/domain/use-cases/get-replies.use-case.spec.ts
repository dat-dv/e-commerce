import { Test, TestingModule } from '@nestjs/testing';
import { GetRepliesUseCase } from './get-replies.use-case';
import { ICommentsRepository } from '../entities/comments.repository.interface';

describe('GetRepliesUseCase', () => {
  let useCase: GetRepliesUseCase;

  const mockCommentsRepository = {
    getReplies: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [GetRepliesUseCase, { provide: ICommentsRepository, useValue: mockCommentsRepository }],
    }).compile();

    useCase = module.get<GetRepliesUseCase>(GetRepliesUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call getReplies on repository', async () => {
    const expectedResult = { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    mockCommentsRepository.getReplies.mockResolvedValue(expectedResult);

    const result = await useCase.execute('parent1', 1, 10);

    expect(result).toBe(expectedResult);
    expect(mockCommentsRepository.getReplies).toHaveBeenCalledWith('parent1', 1, 10);
  });
});
