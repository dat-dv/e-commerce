import { Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IPaginatedResult } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Brand, Product } from '../../../../../generated/prisma/client';

@Injectable()
export class BrandsRepository implements IBrandsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getTopBrands(page: number, limit: number, languageCode = 'vi'): Promise<IPaginatedResult<Brand>> {
    const result = await this.paginationService.paginate(
      this.prisma.brand,
      {
        include: {
          translations: {
            where: { language: { code: languageCode } },
          },
        },
      },
      page,
      limit,
    );

    return result;
  }

  async getBrandBySlug(slug: string, languageCode = 'vi'): Promise<Brand | null> {
    return this.prisma.brand.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { language: { code: languageCode } },
        },
      },
    });
  }

  async getBrandProducts(
    slug: string,
    page: number,
    limit: number,
    languageCode = 'vi',
  ): Promise<{ brand: Brand; products: Product[]; meta: any }> {
    const brand = await this.getBrandBySlug(slug, languageCode);
    if (!brand) {
      return {
        brand: {} as Brand,
        products: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const productsResult = await this.paginationService.paginate(
      this.prisma.product,
      {
        where: { brand_id: brand.id, deleted_at: null },
        include: {
          translations: {
            where: { language: { code: languageCode } },
          },
          skus: true,
          thumbnail: true,
        },
      },
      page,
      limit,
    );

    return {
      brand,
      products: productsResult.items,
      meta: productsResult.meta,
    };
  }
}
