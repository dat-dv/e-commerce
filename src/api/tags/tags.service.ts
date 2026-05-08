import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';
import { PaginationService } from '../../shared/services/pagination/pagination.service';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  async findAll(page: number, limit: number) {
    return this.paginationService.paginate(
      this.prisma.tag,
      {
        where: { deleted_at: null },
      },
      page,
      limit,
    );
  }

  async findOne(id: string) {
    return handlePrismaNotFound(
      this.prisma.tag.findUniqueOrThrow({
        where: { id, deleted_at: null },
      }),
      'Tag not found',
    );
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    return handlePrismaNotFound(
      this.prisma.tag.update({
        where: { id, deleted_at: null },
        data: updateTagDto,
      }),
      'Tag not found',
    );
  }

  async remove(id: string) {
    return handlePrismaNotFound(
      this.prisma.tag.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      }),
      'Tag not found',
    );
  }
}
