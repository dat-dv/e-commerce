import { Injectable } from '@nestjs/common';
import {
  ICommentsRepository,
  CommentWithRelations,
  CommentWithUser,
  CommentModel,
} from '../entities/comments.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService, PaginatedResult } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  private readonly DEFAULT_REPLIES_LIMIT = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getCommentsByPost(postId: string, page: number, limit: number): Promise<PaginatedResult<CommentWithRelations>> {
    return this.paginationService.paginate<CommentWithRelations>(
      this.prisma.comment,
      {
        where: {
          post_id: postId,
          parent_id: null,
          deleted_at: null,
        },
        include: {
          user: {
            select: {
              user_id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
          replies: {
            where: { deleted_at: null },
            take: this.DEFAULT_REPLIES_LIMIT,
            include: {
              user: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { created_at: 'desc' },
      },
      page,
      limit,
    );
  }

  async getReplies(parentId: string, page: number, limit: number): Promise<PaginatedResult<CommentWithUser>> {
    return this.paginationService.paginate<CommentWithUser>(
      this.prisma.comment,
      {
        where: {
          parent_id: parentId,
          deleted_at: null,
        },
        include: {
          user: {
            select: {
              user_id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      },
      page,
      limit,
    );
  }

  async findById(id: string): Promise<CommentModel | null> {
    return this.prisma.comment.findUnique({
      where: { comment_id: id, deleted_at: null },
    });
  }

  async create(data: Prisma.CommentCreateInput): Promise<CommentModel> {
    return this.prisma.comment.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CommentUpdateInput): Promise<CommentModel> {
    return this.prisma.comment.update({
      where: { comment_id: id },
      data,
    });
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return user?.role?.permissions.map((p) => p.permission_name) || [];
  }
}
