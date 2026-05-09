import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCommentUseCase } from './update-comment.use-case';
import { ICommentsRepository } from '../domain/comments.repository.interface';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UpdateCommentUseCase', () => {
  let useCase: UpdateCommentUseCase;

  const mockCommentsRepository = {
    findById: jest.fn(),
    getUserPermissions: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateCommentUseCase, { provide: ICommentsRepository, useValue: mockCommentsRepository }],
    }).compile();

    useCase = module.get<UpdateCommentUseCase>(UpdateCommentUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if comment not found', async () => {
    mockCommentsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'user1', 'New Content')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user cannot update any comment and is not owner', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user2' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue([]);

    await expect(useCase.execute('1', 'user1', 'New Content')).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user is owner but lacks own permission', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user1' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue([]);

    await expect(useCase.execute('1', 'user1', 'New Content')).rejects.toThrow(ForbiddenException);
  });

  it('should update successfully if user is owner and has own permission', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user1' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue(['UPDATE:OWN_COMMENT']);
    mockCommentsRepository.update.mockResolvedValue({ comment_id: '1', content: 'New Content' });

    const result = await useCase.execute('1', 'user1', 'New Content');

    expect(result).toEqual({ comment_id: '1', content: 'New Content' });
    expect(mockCommentsRepository.update).toHaveBeenCalledWith('1', { content: 'New Content' });
  });

  it('should update successfully if user has any permission', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user2' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue(['UPDATE:ANY_COMMENT']);
    mockCommentsRepository.update.mockResolvedValue({ comment_id: '1', content: 'New Content' });

    const result = await useCase.execute('1', 'user1', 'New Content');

    expect(result).toEqual({ comment_id: '1', content: 'New Content' });
    expect(mockCommentsRepository.update).toHaveBeenCalledWith('1', { content: 'New Content' });
  });
});
