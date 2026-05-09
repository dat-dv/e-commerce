import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    comment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockPagination = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment without parent', async () => {
      const mockResult = { comment_id: 'comment-1' };
      mockPrisma.comment.create.mockResolvedValue(mockResult);

      const result = await service.createComment('user-1', 'post-1', 'Hello');

      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Hello',
          post_id: 'post-1',
          user_id: 'user-1',
          parent_id: undefined,
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException if parent comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);

      await expect(service.createComment('user-1', 'post-1', 'Hello', 'parent-1')).rejects.toThrow(BadRequestException);
    });

    it('should create a comment with parent', async () => {
      const parentComment = { comment_id: 'parent-1', parent_id: null };
      const mockResult = { comment_id: 'comment-2' };

      mockPrisma.comment.findUnique.mockResolvedValue(parentComment);
      mockPrisma.comment.create.mockResolvedValue(mockResult);

      const result = await service.createComment('user-1', 'post-1', 'Hello', 'parent-1');

      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Hello',
          post_id: 'post-1',
          user_id: 'user-1',
          parent_id: 'parent-1',
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('should flatten replies (use parent_id of parent comment)', async () => {
      const parentComment = { comment_id: 'parent-2', parent_id: 'grand-parent-1' };
      const mockResult = { comment_id: 'comment-3' };

      mockPrisma.comment.findUnique.mockResolvedValue(parentComment);
      mockPrisma.comment.create.mockResolvedValue(mockResult);

      const result = await service.createComment('user-1', 'post-1', 'Hello', 'parent-2');

      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Hello',
          post_id: 'post-1',
          user_id: 'user-1',
          parent_id: 'grand-parent-1',
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);

      await expect(service.update('comment-1', 'user-1', 'Updated')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user has no permission', async () => {
      const comment = { comment_id: 'comment-1', user_id: 'user-2' }; // Owned by user-2
      const user = { user_id: 'user-1', role: { permissions: [] } }; // Requesting user-1

      mockPrisma.comment.findUnique.mockResolvedValue(comment);
      mockPrisma.user.findUnique.mockResolvedValue(user);

      await expect(service.update('comment-1', 'user-1', 'Updated')).rejects.toThrow(ForbiddenException);
    });

    it('should update if user is owner and has permission', async () => {
      const comment = { comment_id: 'comment-1', user_id: 'user-1' };
      const user = { user_id: 'user-1', role: { permissions: [{ permission_name: 'UPDATE:OWN_COMMENT' }] } };

      mockPrisma.comment.findUnique.mockResolvedValue(comment);
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.comment.update.mockResolvedValue({ ...comment, content: 'Updated' });

      const result = await service.update('comment-1', 'user-1', 'Updated');

      expect(mockPrisma.comment.update).toHaveBeenCalled();
      expect(result.content).toBe('Updated');
    });

    it('should update if user has ANY permission', async () => {
      const comment = { comment_id: 'comment-1', user_id: 'user-2' };
      const user = { user_id: 'user-1', role: { permissions: [{ permission_name: 'UPDATE:ANY_COMMENT' }] } };

      mockPrisma.comment.findUnique.mockResolvedValue(comment);
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.comment.update.mockResolvedValue({ ...comment, content: 'Updated' });

      const result = await service.update('comment-1', 'user-1', 'Updated');

      expect(mockPrisma.comment.update).toHaveBeenCalled();
      expect(result.content).toBe('Updated');
    });
  });
});
