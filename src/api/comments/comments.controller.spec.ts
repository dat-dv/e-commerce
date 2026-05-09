import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';
import { GetCommentsByPostUseCase } from './use-cases/get-comments-by-post.use-case';
import { GetRepliesUseCase } from './use-cases/get-replies.use-case';
import { UpdateCommentUseCase } from './use-cases/update-comment.use-case';
import { RemoveCommentUseCase } from './use-cases/remove-comment.use-case';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { GetRepliesDto } from './dto/get-replies.dto';

describe('CommentsController', () => {
  let controller: CommentsController;

  const mockCreateCommentUseCase = { execute: jest.fn() };
  const mockGetCommentsByPostUseCase = { execute: jest.fn() };
  const mockGetRepliesUseCase = { execute: jest.fn() };
  const mockUpdateCommentUseCase = { execute: jest.fn() };
  const mockRemoveCommentUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CreateCommentUseCase, useValue: mockCreateCommentUseCase },
        { provide: GetCommentsByPostUseCase, useValue: mockGetCommentsByPostUseCase },
        { provide: GetRepliesUseCase, useValue: mockGetRepliesUseCase },
        { provide: UpdateCommentUseCase, useValue: mockUpdateCommentUseCase },
        { provide: RemoveCommentUseCase, useValue: mockRemoveCommentUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateCommentUseCase.execute and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { content: 'Hello', parent_id: 'parent-1' } as unknown as CreateCommentDto;
      const serviceResult = { comment_id: 'comment-1' };

      mockCreateCommentUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.create(req, 'post-1', dto);

      expect(mockCreateCommentUseCase.execute).toHaveBeenCalledWith('user-1', 'post-1', 'Hello', 'parent-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('getComments', () => {
    it('should call GetCommentsByPostUseCase.execute and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockGetCommentsByPostUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.getComments('post-1', query);

      expect(mockGetCommentsByPostUseCase.execute).toHaveBeenCalledWith('post-1', 1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('getReplies', () => {
    it('should call GetRepliesUseCase.execute and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockGetRepliesUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.getReplies('comment-1', query);

      expect(mockGetRepliesUseCase.execute).toHaveBeenCalledWith('comment-1', 1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call UpdateCommentUseCase.execute and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { content: 'Updated' };
      const serviceResult = { comment_id: 'comment-1' };

      mockUpdateCommentUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.update(req, 'comment-1', dto);

      expect(mockUpdateCommentUseCase.execute).toHaveBeenCalledWith('comment-1', 'user-1', 'Updated');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call RemoveCommentUseCase.execute and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const serviceResult = { comment_id: 'comment-1' };

      mockRemoveCommentUseCase.execute.mockResolvedValue(serviceResult);

      const result = await controller.remove(req, 'comment-1');

      expect(mockRemoveCommentUseCase.execute).toHaveBeenCalledWith('comment-1', 'user-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
