import { Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IBrandResponse, IPaginatedResult, IBrandProductsResponse } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class BrandsRepository implements IBrandsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private getBrandInclude(languageCode: string) {
    return {
      translations: {
        where: { language: { code: languageCode } },
      },
    };
  }

  async getTopBrands(page: number, limit: number, languageCode = 'vi'): Promise<IPaginatedResult<IBrandResponse>> {
    return this.paginationService.paginate(
      this.prisma.brand,
      {
        where: { is_featured: true },
        orderBy: { order: 'asc' },
        include: this.getBrandInclude(languageCode),
      },
      page,
      limit,
    );
  }

  async getBrandBySlug(slug: string, languageCode = 'vi'): Promise<IBrandResponse | null> {
    return this.prisma.brand.findUnique({
      where: { slug },
      include: this.getBrandInclude(languageCode),
    });
  }

  async getBrandProducts(
    slug: string,
    page: number,
    limit: number,
    languageCode = 'vi',
  ): Promise<IBrandProductsResponse> {
    const brand = await this.getBrandBySlug(slug, languageCode);
    if (!brand) {
      return {
        brand: {} as IBrandResponse,
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
