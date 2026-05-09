import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { GetRepliesDto } from './dto/get-replies.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    createComment: jest.fn(),
    getCommentsByPost: jest.fn(),
    getReplies: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.createComment and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { content: 'Hello', parent_id: 'parent-1' } as unknown as CreateCommentDto;
      const serviceResult = { comment_id: 'comment-1' };

      mockCommentsService.createComment.mockResolvedValue(serviceResult);

      const result = await controller.create(req, 'post-1', dto);

      expect(mockCommentsService.createComment).toHaveBeenCalledWith('user-1', 'post-1', 'Hello', 'parent-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('getComments', () => {
    it('should call service.getCommentsByPost and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockCommentsService.getCommentsByPost.mockResolvedValue(serviceResult);

      const result = await controller.getComments('post-1', query);

      expect(mockCommentsService.getCommentsByPost).toHaveBeenCalledWith('post-1', 1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('getReplies', () => {
    it('should call service.getReplies and return success response', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [], total: 0 };

      mockCommentsService.getReplies.mockResolvedValue(serviceResult);

      const result = await controller.getReplies('comment-1', query);

      expect(mockCommentsService.getReplies).toHaveBeenCalledWith('comment-1', 1, 10);
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('update', () => {
    it('should call service.update and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const dto = { content: 'Updated' };
      const serviceResult = { comment_id: 'comment-1' };

      mockCommentsService.update.mockResolvedValue(serviceResult);

      const result = await controller.update(req, 'comment-1', dto);

      expect(mockCommentsService.update).toHaveBeenCalledWith('comment-1', 'user-1', 'Updated');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success response', async () => {
      const req = { user: { sub: 'user-1' } } as unknown as Express.Request;
      const serviceResult = { comment_id: 'comment-1' };

      mockCommentsService.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove(req, 'comment-1');

      expect(mockCommentsService.remove).toHaveBeenCalledWith('comment-1', 'user-1');
      expect(result).toEqual(expect.objectContaining({ status: 'success', data: serviceResult }));
    });
  });
});
