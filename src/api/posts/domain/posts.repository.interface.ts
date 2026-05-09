import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    post_tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export type PostDetails = Prisma.PostGetPayload<{
  include: {
    post_tags: {
      include: {
        tag: true;
      };
    };
    _count: {
      select: { comments: true };
    };
  };
}>;

export interface IPostsRepository {
  create(data: Prisma.PostCreateInput): Promise<Prisma.PostGetPayload<Record<string, never>>>;

  findAll(page: number, limit: number): Promise<PaginatedResult<PostWithRelations>>;

  findById(id: string): Promise<PostDetails | null>;

  update(id: string, data: Prisma.PostUpdateInput): Promise<Prisma.PostGetPayload<Record<string, never>>>;

  delete(id: string): Promise<Prisma.PostGetPayload<Record<string, never>>>;

  getUserPermissions(userId: string): Promise<string[]>;

  countTags(tagIds: string[]): Promise<number>;
}

export const IPostsRepository = Symbol('IPostsRepository');
