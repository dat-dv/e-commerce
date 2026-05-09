import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommentUseCase } from './create-comment.use-case';
import { ICommentsRepository } from '../entities/comments.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;

  const mockCommentsRepository = {
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateCommentUseCase, { provide: ICommentsRepository, useValue: mockCommentsRepository }],
    }).compile();

    useCase = module.get<CreateCommentUseCase>(CreateCommentUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException if parent comment not found', async () => {
    mockCommentsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('user1', 'post1', 'Content', 'parent1')).rejects.toThrow(BadRequestException);
  });

  it('should create comment successfully without parent', async () => {
    const mockComment = { comment_id: '1', content: 'Content' };
    mockCommentsRepository.create.mockResolvedValue(mockComment);

    const result = await useCase.execute('user1', 'post1', 'Content');

    expect(result).toBe(mockComment);
    expect(mockCommentsRepository.create).toHaveBeenCalledWith({
      content: 'Content',
      post: { connect: { post_id: 'post1' } },
      user: { connect: { user_id: 'user1' } },
      parent: undefined,
    });
  });

  it('should create comment successfully with parent (flattened)', async () => {
    const mockComment = { comment_id: '1', content: 'Content' };
    const parentComment = { comment_id: 'parent1', parent_id: 'grandparent1' };
    mockCommentsRepository.findById.mockResolvedValue(parentComment);
    mockCommentsRepository.create.mockResolvedValue(mockComment);

    const result = await useCase.execute('user1', 'post1', 'Content', 'parent1');

    expect(result).toBe(mockComment);
    expect(mockCommentsRepository.create).toHaveBeenCalledWith({
      content: 'Content',
      post: { connect: { post_id: 'post1' } },
      user: { connect: { user_id: 'user1' } },
      parent: { connect: { comment_id: 'grandparent1' } },
    });
  });
});
