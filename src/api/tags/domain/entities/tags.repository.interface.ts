import { ITag } from './tag.entity';
import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface ITagsRepository {
  create(data: Prisma.TagCreateInput): Promise<ITag>;

  findAll(page: number, limit: number): Promise<PaginatedResult<ITag>>;

  findById(id: string): Promise<ITag | null>;

  update(id: string, data: Prisma.TagUpdateInput): Promise<ITag>;

  delete(id: string): Promise<ITag>;
}

export const ITagsRepository = Symbol('ITagsRepository');
