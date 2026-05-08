import { BadRequestException, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
        finalParentId = parentComment.parent_id;
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

  async update(id: string, requestingUserId: string, content: string) {
    const comment = await this.prismaClient.comment.findUnique({
      where: { comment_id: id, deleted_at: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.checkOwnershipOrPermission(
      comment.user_id,
      requestingUserId,
      'UPDATE:OWN_COMMENT',
      'UPDATE:ANY_COMMENT',
    );

    return this.prismaClient.comment.update({
      where: { comment_id: id },
      data: { content },
    });
  }

  async remove(id: string, requestingUserId: string) {
    const comment = await this.prismaClient.comment.findUnique({
      where: { comment_id: id, deleted_at: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.checkOwnershipOrPermission(
      comment.user_id,
      requestingUserId,
      'DELETE:OWN_COMMENT',
      'DELETE:ANY_COMMENT',
    );

    return this.prismaClient.comment.update({
      where: { comment_id: id },
      data: { deleted_at: new Date() },
    });
  }

  private async checkOwnershipOrPermission(
    resourceUserId: string,
    requestingUserId: string,
    ownPermission: string,
    anyPermission: string,
  ) {
    const user = await this.prismaClient.user.findUnique({
      where: { user_id: requestingUserId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const userPermissions = user?.role?.permissions.map((p) => p.permission_name) || [];

    if (userPermissions.includes(anyPermission)) {
      return;
    }

    const isOwner = resourceUserId === requestingUserId;
    if (isOwner) {
      if (!userPermissions.includes(ownPermission)) {
        throw new ForbiddenException(
          `You do not have the '${ownPermission}' permission to action on your own resource`,
        );
      }
    } else {
      throw new ForbiddenException(
        `You do not have the '${anyPermission}' permission to action on other people's resources`,
      );
    }
  }
}
