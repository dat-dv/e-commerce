import { Injectable } from '@nestjs/common';
import { IUploadRepository } from '../entities/upload.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { IImage } from '../entities/image.entity';

@Injectable()
export class UploadRepository implements IUploadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createImage(data: Prisma.ImageCreateInput): Promise<IImage> {
    return this.prisma.image.create({
      data,
    });
  }
}
