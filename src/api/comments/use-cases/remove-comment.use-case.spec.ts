import { Test, TestingModule } from '@nestjs/testing';
import { RemoveCommentUseCase } from './remove-comment.use-case';
import { ICommentsRepository } from '../domain/comments.repository.interface';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('RemoveCommentUseCase', () => {
  let useCase: RemoveCommentUseCase;

  const mockCommentsRepository = {
    findById: jest.fn(),
    getUserPermissions: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveCommentUseCase, { provide: ICommentsRepository, useValue: mockCommentsRepository }],
    }).compile();

    useCase = module.get<RemoveCommentUseCase>(RemoveCommentUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if comment not found', async () => {
    mockCommentsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'user1')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user cannot delete any comment and is not owner', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user2' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue([]);

    await expect(useCase.execute('1', 'user1')).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user is owner but lacks own permission', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user1' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue([]);

    await expect(useCase.execute('1', 'user1')).rejects.toThrow(ForbiddenException);
  });

  it('should delete successfully if user is owner and has own permission', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user1' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue(['DELETE:OWN_COMMENT']);
    mockCommentsRepository.update.mockResolvedValue({ comment_id: '1', deleted_at: new Date() });

    const result = await useCase.execute('1', 'user1');

    expect(result).toEqual(expect.objectContaining({ comment_id: '1' }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(mockCommentsRepository.update).toHaveBeenCalledWith('1', { deleted_at: expect.any(Date) });
  });

  it('should delete successfully if user has any permission', async () => {
    mockCommentsRepository.findById.mockResolvedValue({ comment_id: '1', user_id: 'user2' });
    mockCommentsRepository.getUserPermissions.mockResolvedValue(['DELETE:ANY_COMMENT']);
    mockCommentsRepository.update.mockResolvedValue({ comment_id: '1', deleted_at: new Date() });

    const result = await useCase.execute('1', 'user1');

    expect(result).toEqual(expect.objectContaining({ comment_id: '1' }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(mockCommentsRepository.update).toHaveBeenCalledWith('1', { deleted_at: expect.any(Date) });
  });
});
