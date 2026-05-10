import { Injectable } from '@nestjs/common';
import {
  ICommentsRepository,
  ICommentWithRelations,
  ICommentWithUser,
} from '../entities/comments.repository.interface';
import { IComment } from '../entities/comment.entity';
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

  async getCommentsByPost(
    postId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ICommentWithRelations>> {
    return this.paginationService.paginate<ICommentWithRelations>(
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
              id: true,
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
                  id: true,
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

  async getReplies(parentId: string, page: number, limit: number): Promise<PaginatedResult<ICommentWithUser>> {
    return this.paginationService.paginate<ICommentWithUser>(
      this.prisma.comment,
      {
        where: {
          parent_id: parentId,
          deleted_at: null,
        },
        include: {
          user: {
            select: {
              id: true,
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

  async findById(id: string): Promise<IComment | null> {
    return this.prisma.comment.findUnique({
      where: { id, deleted_at: null },
    });
  }

  async create(data: Prisma.CommentCreateInput): Promise<IComment> {
    return this.prisma.comment.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CommentUpdateInput): Promise<IComment> {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
