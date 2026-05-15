import { Injectable } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IPaginatedResult } from '@ecommerce/shared';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { ProductCategory } from '../../../../../generated/prisma/client';

@Injectable()
export class ProductCategoriesRepository implements IProductCategoriesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: { name: string; slug: string; description?: string }): Promise<ProductCategory> {
    return this.prisma.productCategory.create({
      data,
      include: { translations: true, children: true },
    });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<ProductCategory> {
    return this.prisma.productCategory.update({
      where: { id },
      data,
      include: { translations: true, children: true },
    });
  }

  async findMany(params?: {
    page?: number;
    limit?: number;
    level?: number;
  }): Promise<IPaginatedResult<ProductCategory>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const result = await this.paginationService.paginate(
      this.prisma.productCategory,
      {
        where: { level: params?.level },
        include: { translations: true, children: true },
      },
      page,
      limit,
    );

    return result;
  }

  async findGroups(
    languageCode: string = 'vi',
    params?: { page?: number; limit?: number },
  ): Promise<IPaginatedResult<ProductCategory>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const result = await this.paginationService.paginate(
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
          children: true,
        },
      },
      page,
      limit,
    );

    return result;
  }

  async findById(id: string, languageCode: string = 'vi'): Promise<ProductCategory | null> {
    return this.prisma.productCategory.findUnique({
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
  }

  async findTree(languageCode: string = 'vi'): Promise<ProductCategory[]> {
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

  async findTreeBySlug(slug: string, languageCode: string = 'vi'): Promise<ProductCategory | null> {
    return this.prisma.productCategory.findUnique({
      where: { slug },
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

  async delete(id: string): Promise<ProductCategory> {
    return this.prisma.productCategory.delete({
      where: { id },
      include: { translations: true, children: true },
    });
  }
}
