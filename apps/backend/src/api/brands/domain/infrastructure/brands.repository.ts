import { Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IBrandResponse, IPaginatedResult, IBrandProductsResponse, ICategoryResponse } from '@ecommerce/shared';
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

  private getBrandIncludeWithProductCount(languageCode: string) {
    return {
      ...this.getBrandInclude(languageCode),
      _count: {
        select: {
          products: {
            where: { deleted_at: null },
          },
        },
      },
    };
  }

  private toBrandResponseWithProductCount(brand: IBrandResponse & { _count?: { products?: number } }): IBrandResponse {
    const { _count, ...rest } = brand;

    return {
      ...rest,
      product_count: _count?.products ?? 0,
    };
  }

  async getTopBrands(page: number, limit: number, languageCode = 'vi'): Promise<IPaginatedResult<IBrandResponse>> {
    const result = await this.paginationService.paginate(
      this.prisma.brand,
      {
        where: { is_featured: true },
        orderBy: { order: 'asc' },
        include: this.getBrandIncludeWithProductCount(languageCode),
      },
      page,
      limit,
    );

    return {
      ...result,
      items: result.items.map((brand) => this.toBrandResponseWithProductCount(brand)),
    };
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
    search?: string,
  ): Promise<IBrandProductsResponse> {
    const brand = await this.getBrandBySlug(slug, languageCode);
    if (!brand) {
      return {
        brand: {} as IBrandResponse,
        products: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const trimmedSearch = search?.trim();
    const where = {
      brand_id: brand.id,
      deleted_at: null,
      ...(trimmedSearch
        ? {
            translations: {
              some: {
                language: { code: languageCode },
                OR: [{ name: { contains: trimmedSearch } }, { description: { contains: trimmedSearch } }],
              },
            },
          }
        : {}),
    };

    const productsResult = await this.paginationService.paginate(
      this.prisma.product,
      {
        where,
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

  async getBrandCategoryTree(slug: string, languageCode = 'vi'): Promise<ICategoryResponse[]> {
    const brand = await this.getBrandBySlug(slug, languageCode);
    if (!brand) return [];

    // 1. Get all categories that have active products under this brand (optimized by brand_id index)
    const categoriesWithProducts = await this.prisma.productCategory.findMany({
      where: {
        product_categories: {
          some: {
            product: {
              brand_id: brand.id,
              deleted_at: null,
            },
          },
        },
      },
      include: {
        translations: {
          where: { language: { code: languageCode } },
        },
      },
    });

    // 2. We need to collect parent categories for any child category to build a complete tree
    const categoryIds = new Set<string>();
    const parentIds = new Set<string>();

    categoriesWithProducts.forEach((cat) => {
      categoryIds.add(cat.id);
      if (cat.parent_id) {
        parentIds.add(cat.parent_id);
      }
    });

    // Fetch missing parent categories
    const missingParentIds = Array.from(parentIds).filter((id) => !categoryIds.has(id));
    let parentCategories: ICategoryResponse[] = [];
    if (missingParentIds.length > 0) {
      parentCategories = await this.prisma.productCategory.findMany({
        where: {
          id: { in: missingParentIds },
        },
        include: {
          translations: {
            where: { language: { code: languageCode } },
          },
        },
      });
    }

    // Combine both lists
    const allCategories = [...categoriesWithProducts, ...parentCategories];

    // 3. Build the tree (2 levels deep for display)
    const rootCategories = allCategories.filter((cat) => !cat.parent_id);

    return rootCategories.map((root) => {
      const children = allCategories.filter((cat) => cat.parent_id === root.id);
      return {
        ...root,
        children: children.map((child) => ({
          ...child,
          children: [],
        })),
      };
    });
  }
}
