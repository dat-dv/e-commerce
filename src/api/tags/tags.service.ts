import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  findAll() {
    return this.prisma.tag.findMany({
      where: { deleted_at: null },
    });
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
