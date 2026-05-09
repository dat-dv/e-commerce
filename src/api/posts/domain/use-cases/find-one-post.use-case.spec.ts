import { Test, TestingModule } from '@nestjs/testing';
import { FindOnePostUseCase } from './find-one-post.use-case';
import { IPostsRepository } from '../entities/posts.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('FindOnePostUseCase', () => {
  let useCase: FindOnePostUseCase;

  const mockPostsRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOnePostUseCase, { provide: IPostsRepository, useValue: mockPostsRepository }],
    }).compile();

    useCase = module.get<FindOnePostUseCase>(FindOnePostUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if post not found', async () => {
    mockPostsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(BadRequestException);
  });

  it('should return post details with total comments', async () => {
    const mockPost = {
      id: '1',
      title: 'Title',
      _count: { comments: 5 },
    };
    mockPostsRepository.findById.mockResolvedValue(mockPost);

    const result = await useCase.execute('1');

    expect(result).toEqual({
      id: '1',
      title: 'Title',
      total_comments: 5,
    });
  });
});
