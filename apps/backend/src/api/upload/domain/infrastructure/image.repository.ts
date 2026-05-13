import { Injectable } from '@nestjs/common';
import { IImageRepository, ImageCreateInput } from '../entities/upload.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IImage } from '@ecommerce/shared';

@Injectable()
export class ImageRepository implements IImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveImage(data: IImage): Promise<IImage> {
    const img = await this.prisma.image.create({
      data,
    });

    return img;
  }
}
