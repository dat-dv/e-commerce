import type { IAttributeListResponse } from '@ecommerce/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IAttributesRepository } from '../entities/attributes.repository.interface';

@Injectable()
export class AttributesRepository implements IAttributesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<IAttributeListResponse> {
    return this.prisma.attribute.findMany({
      include: {
        values: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
