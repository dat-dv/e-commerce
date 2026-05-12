import { Injectable } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class ProductCategoriesRepository implements IProductCategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; slug: string; description?: string }) {
    return this.prisma.productCategory.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string }) {
    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async findAll() {
    return this.prisma.productCategory.findMany();
  }

  async delete(id: string) {
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
}
