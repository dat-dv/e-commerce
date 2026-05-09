import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export type CommentWithRelations = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        user_id: true;
        first_name: true;
        last_name: true;
        email: true;
      };
    };
    replies: {
      include: {
        user: {
          select: {
            user_id: true;
            first_name: true;
            last_name: true;
            email: true;
          };
        };
      };
    };
    _count: {
      select: { replies: true };
    };
  };
}>;

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        user_id: true;
        first_name: true;
        last_name: true;
        email: true;
      };
    };
  };
}>;

export type CommentModel = Prisma.CommentGetPayload<Record<string, never>>;

export interface ICommentsRepository {
  getCommentsByPost(postId: string, page: number, limit: number): Promise<PaginatedResult<CommentWithRelations>>;

  getReplies(parentId: string, page: number, limit: number): Promise<PaginatedResult<CommentWithUser>>;

  findById(id: string): Promise<CommentModel | null>;

  create(data: Prisma.CommentCreateInput): Promise<CommentModel>;

  update(id: string, data: Prisma.CommentUpdateInput): Promise<CommentModel>;

  getUserPermissions(userId: string): Promise<string[]>;
}

export const ICommentsRepository = Symbol('ICommentsRepository');
