import { IComment } from './comment.entity';
import { IUser } from '../../../users/domain/entities/user.entity';
import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface ICommentWithUser extends IComment {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ICommentWithRelations extends ICommentWithUser {
  replies: ICommentWithUser[];
  _count: {
    replies: number;
  };
}

export interface ICommentsRepository {
  getCommentsByPost(postId: string, page: number, limit: number): Promise<PaginatedResult<ICommentWithRelations>>;

  getReplies(parentId: string, page: number, limit: number): Promise<PaginatedResult<ICommentWithUser>>;

  findById(id: string): Promise<IComment | null>;

  create(data: Prisma.CommentCreateInput): Promise<IComment>;

  update(id: string, data: Prisma.CommentUpdateInput): Promise<IComment>;

  getUserPermissions(userId: string): Promise<string[]>;
}

export const ICommentsRepository = Symbol('ICommentsRepository');
