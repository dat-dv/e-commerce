import { Injectable } from '@nestjs/common';
import { ICategoriesRepository } from '../entities/categories.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; slug: string; description?: string }) {
    return this.prisma.category.create({
      data,
    });
  }
}
