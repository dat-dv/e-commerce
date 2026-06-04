import { IBrandProductsResponse, IBrandResponse, ICategoryResponse, IPaginatedResult } from '@ecommerce/shared';
import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { GetBrandListDto } from '../../dto/get-brand-list.dto';
import { GetBrandProductsDto } from '../../dto/get-brand-products.dto';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

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

  async getBrandList(
    query: GetBrandListDto,
    languageCode = DEFAULT_LANGUAGE_CODE,
  ): Promise<IPaginatedResult<IBrandResponse>> {
    const trimmedSearch = query.search?.trim();
    const where = {
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

    const result = await this.paginationService.paginate(
      this.prisma.brand,
      {
        where,
        orderBy: { order: 'asc' },
        include: this.getBrandIncludeWithProductCount(languageCode),
      },
      query.page,
      query.limit,
    );

    return {
      ...result,
      items: result.items.map((brand) => this.toBrandResponseWithProductCount(brand)),
    };
  }

  async getBrandBySlug(slug: string, languageCode = DEFAULT_LANGUAGE_CODE): Promise<IBrandResponse | null> {
    return this.prisma.brand.findUnique({
      where: { slug },
      include: this.getBrandInclude(languageCode),
    });
  }

  async getBrandProducts(
    slug: string,
    query: GetBrandProductsDto,
    languageCode = DEFAULT_LANGUAGE_CODE,
  ): Promise<IBrandProductsResponse> {
    const brand = await this.getBrandBySlug(slug, languageCode);
    if (!brand) {
      return {
        brand: {} as IBrandResponse,
        products: [],
        meta: { total: 0, page: query.page, limit: query.limit, totalPages: 0 },
      };
    }

    const trimmedSearch = query.search?.trim();
    const trimmedCategory = query.category?.trim();
    const categoryIds = trimmedCategory ? await this.getDescendantCategoryIds(trimmedCategory) : [];
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
      ...(trimmedCategory
        ? {
            categories: {
              some: {
                category_id: { in: categoryIds },
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
      query.page,
      query.limit,
    );

    return {
      brand,
      products: productsResult.items,
      meta: productsResult.meta,
    };
  }

  async getBrandCategoryTree(slug: string, languageCode = DEFAULT_LANGUAGE_CODE): Promise<ICategoryResponse[]> {
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

  private async getDescendantCategoryIds(categorySlug: string): Promise<string[]> {
    const category = await this.prisma.productCategory.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });

    if (!category) return [];

    const ids: string[] = [category.id];
    let currentLevelIds: string[] = [category.id];

    while (currentLevelIds.length > 0) {
      const children = await this.prisma.productCategory.findMany({
        where: { parent_id: { in: currentLevelIds } },
        select: { id: true },
      });

      currentLevelIds = children.map((c) => c.id);
      ids.push(...currentLevelIds);
    }

    return ids;
  }
}
