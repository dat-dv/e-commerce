import { Injectable } from '@nestjs/common';
import { ITagsRepository } from '../entities/tags.repository.interface';
import { ITag } from '../entities/tag.entity';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class TagsRepository implements ITagsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.TagCreateInput): Promise<ITag> {
    return this.prisma.tag.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<ITag>> {
    return this.paginationService.paginate<ITag>(
      this.prisma.tag,
      {
        where: { deleted_at: null },
      },
      page,
      limit,
    );
  }

  async findById(id: string): Promise<ITag | null> {
    return this.prisma.tag.findUnique({
      where: { id, deleted_at: null },
    });
  }

  async update(id: string, data: Prisma.TagUpdateInput): Promise<ITag> {
    return this.prisma.tag.update({
      where: { id, deleted_at: null },
      data,
    });
  }

  async delete(id: string): Promise<ITag> {
    return this.prisma.tag.update({
      where: { id, deleted_at: null },
      data: { deleted_at: new Date() },
    });
  }
}
