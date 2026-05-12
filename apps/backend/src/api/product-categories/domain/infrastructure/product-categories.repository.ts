import { Injectable } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IProductCategory } from '../entities/product-category.entity';

@Injectable()
export class ProductCategoriesRepository implements IProductCategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; slug: string; description?: string }): Promise<IProductCategory> {
    return this.prisma.productCategory.create({
      data,
    }) as unknown as IProductCategory;
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<IProductCategory> {
    return this.prisma.productCategory.update({
      where: { id },
      data,
    }) as unknown as IProductCategory;
  }

  async findAll(): Promise<IProductCategory[]> {
    return this.prisma.productCategory.findMany({
      include: {
        translations: true,
      },
    }) as unknown as IProductCategory[];
  }

  async findGroups(languageCode: string = 'vi'): Promise<IProductCategory[]> {
    return this.prisma.productCategory.findMany({
      where: {
        parent_id: null,
      },
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
      },
    }) as unknown as IProductCategory[];
  }

  async findById(id: string, languageCode: string = 'vi'): Promise<IProductCategory | null> {
    const result = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
        children: {
          include: {
            translations: {
              where: {
                language: {
                  code: languageCode,
                },
              },
            },
          },
        },
      },
    });
    return result as unknown as IProductCategory | null;
  }

  async findTree(languageCode: string = 'vi'): Promise<IProductCategory[]> {
    return this.prisma.productCategory.findMany({
      where: {
        parent_id: null, // Chỉ lấy các danh mục gốc
      },
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
        children: {
          include: {
            translations: {
              where: {
                language: {
                  code: languageCode,
                },
              },
            },
          },
        },
      },
    }) as unknown as IProductCategory[];
  }

  async delete(id: string): Promise<IProductCategory> {
    return this.prisma.productCategory.delete({
      where: { id },
    }) as unknown as IProductCategory;
  }
}
