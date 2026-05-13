import { Injectable } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IProductCategory } from '@ecommerce/shared';
import { PaginationService, PaginatedResult } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class ProductCategoriesRepository implements IProductCategoriesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

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

  async findMany(params?: {
    page?: number;
    limit?: number;
    level?: number;
  }): Promise<PaginatedResult<IProductCategory>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return this.paginationService.paginate<IProductCategory>(
      this.prisma.productCategory,
      {
        where: { level: params?.level },
        include: { translations: true },
      },
      page,
      limit,
    );
  }

  async findGroups(
    languageCode: string = 'vi',
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedResult<IProductCategory>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    return this.paginationService.paginate<IProductCategory>(
      this.prisma.productCategory,
      {
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
      },
      page,
      limit,
    );
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
