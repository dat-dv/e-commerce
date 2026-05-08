import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class CommentsService {
  private readonly DEFAULT_REPLIES_LIMIT = 3;

  constructor(
    private readonly prismaClient: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getCommentsByPost(postId: string, page: number, limit: number) {
    return this.paginationService.paginate(
      this.prismaClient.comment,
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

  async getReplies(parentId: string, page: number, limit: number) {
    return this.paginationService.paginate(this.prismaClient.comment, {
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
    });
  }

  async createComment(userId: string, postId: string, content: string, parentId?: string) {
    let finalParentId: string | null | undefined = parentId;

    if (parentId) {
      const parentComment = await this.prismaClient.comment.findUnique({
        where: { comment_id: parentId },
      });

      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }

      if (parentComment.parent_id) {
        finalParentId = parentComment.parent_id as string;
      }
    }

    return this.prismaClient.comment.create({
      data: {
        content,
        post_id: postId,
        user_id: userId,
        parent_id: finalParentId,
      },
    });
  }
}
