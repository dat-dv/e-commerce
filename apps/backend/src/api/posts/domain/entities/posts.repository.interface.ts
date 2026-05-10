import { IPost } from './post.entity';
import { ITag } from '../../../tags/domain/entities/tag.entity';
import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IPostWithRelations extends IPost {
  post_tags: {
    tag: ITag;
  }[];
}

export interface IPostDetails extends IPostWithRelations {
  _count: {
    comments: number;
  };
}

export interface IPostsRepository {
  create(data: Prisma.PostCreateInput): Promise<IPost>;

  findAll(page: number, limit: number): Promise<PaginatedResult<IPostWithRelations>>;

  findById(id: string): Promise<IPostDetails | null>;

  update(id: string, data: Prisma.PostUpdateInput): Promise<IPost>;

  delete(id: string): Promise<IPost>;

  getUserPermissions(userId: string): Promise<string[]>;

  countTags(tagIds: string[]): Promise<number>;
}

export const IPostsRepository = Symbol('IPostsRepository');
