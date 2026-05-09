import { Injectable } from '@nestjs/common';
import { ITagsRepository, PaginatedResult } from '../domain/tags.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class TagsRepository implements ITagsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.TagCreateInput): Promise<Prisma.TagGetPayload<Record<string, never>>> {
    return this.prisma.tag.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<Prisma.TagGetPayload<Record<string, never>>>> {
    return this.paginationService.paginate<Prisma.TagGetPayload<Record<string, never>>>(
      this.prisma.tag,
      {
        where: { deleted_at: null },
      },
      page,
      limit,
    );
  }

  async findById(id: string): Promise<Prisma.TagGetPayload<Record<string, never>> | null> {
    return this.prisma.tag.findUnique({
      where: { id, deleted_at: null },
    });
  }

  async update(id: string, data: Prisma.TagUpdateInput): Promise<Prisma.TagGetPayload<Record<string, never>>> {
    return this.prisma.tag.update({
      where: { id, deleted_at: null },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.TagGetPayload<Record<string, never>>> {
    return this.prisma.tag.update({
      where: { id, deleted_at: null },
      data: { deleted_at: new Date() },
    });
  }
}
