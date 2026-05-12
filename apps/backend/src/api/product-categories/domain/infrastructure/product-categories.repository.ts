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
    });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<IProductCategory> {
    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async findMany(params?: { page?: number; limit?: number; level?: number }): Promise<IProductCategory[]> {
    const skip = params?.page && params?.limit ? (params.page - 1) * params.limit : undefined;
    const take = params?.limit;

    return this.prisma.productCategory.findMany({
      skip,
      take,
      include: {
        translations: true,
      },
      where: {
        level: params?.level,
      },
    });
  }

  async findGroups(
    languageCode: string = 'vi',
    params?: { page?: number; limit?: number },
  ): Promise<IProductCategory[]> {
    const skip = params?.page && params?.limit ? (params.page - 1) * params.limit : undefined;
    const take = params?.limit;

    return this.prisma.productCategory.findMany({
      where: {
        parent_id: null,
      },
      skip,
      take,
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
      },
    });
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
    return result;
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
    });
  }

  async delete(id: string): Promise<IProductCategory> {
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
}
