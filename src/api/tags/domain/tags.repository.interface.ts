import { Prisma } from 'generated/prisma/client';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface ITagsRepository {
  create(data: Prisma.TagCreateInput): Promise<Prisma.TagGetPayload<Record<string, never>>>;

  findAll(page: number, limit: number): Promise<PaginatedResult<Prisma.TagGetPayload<Record<string, never>>>>;

  findById(id: string): Promise<Prisma.TagGetPayload<Record<string, never>> | null>;

  update(id: string, data: Prisma.TagUpdateInput): Promise<Prisma.TagGetPayload<Record<string, never>>>;

  delete(id: string): Promise<Prisma.TagGetPayload<Record<string, never>>>;
}

export const ITagsRepository = Symbol('ITagsRepository');
