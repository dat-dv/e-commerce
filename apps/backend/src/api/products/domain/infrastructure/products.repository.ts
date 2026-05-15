import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IPaginatedResult, IProductResponse, IFlashSaleResponse, Review as IReviewResponse } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { GetProductsDto } from '../../dto/get-products.dto';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private getProductInclude(languageCode: string) {
    return {
      thumbnail: true,
      brand: {
        include: {
          translations: {
            where: { language: { code: languageCode } },
          },
        },
      },
      categories: {
        include: {
          category: {
            include: {
              translations: {
                where: { language: { code: languageCode } },
              },
            },
          },
        },
      },
      translations: {
        where: {
          language: {
            code: languageCode,
          },
        },
      },
      skus: {
        include: {
          sku_attribute_values: {
            include: {
              attribute_value: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      },
    };
  }

  async findById(id: string, languageCode = 'en'): Promise<IProductResponse | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: this.getProductInclude(languageCode),
    });
  }

  async findBySlug(slug: string, languageCode = 'en'): Promise<IProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: this.getProductInclude(languageCode),
    });

    if (!product) {
      return this.findById(slug, languageCode);
    }

    return product;
  }

  async recordView(userId: string, productId: string): Promise<void> {
    await this.prisma.userBrowsingHistory.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });
  }

  async getUserTopCategory(userId: string): Promise<string | null> {
    const history = await this.prisma.userBrowsingHistory.findMany({
      where: { user_id: userId },
      select: { product_id: true },
    });

    if (history.length === 0) return null;

    const counts = new Map<string, number>();
    for (const item of history) {
      counts.set(item.product_id, (counts.get(item.product_id) || 0) + 1);
    }

    let topProductId = '';
    let maxCount = 0;
    for (const [id, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        topProductId = id;
      }
    }

    const product = await this.prisma.product.findUnique({
      where: { id: topProductId },
      select: {
        categories: {
          select: { category_id: true },
          take: 1,
        },
      },
    });

    return product?.categories[0]?.category_id || null;
  }

  async getActiveFlashSale(languageCode = 'en'): Promise<IFlashSaleResponse | null> {
    const now = new Date();
    return this.prisma.flashSale.findFirst({
      where: {
        start_time: { lte: now },
        end_time: { gte: now },
      },
      include: {
        products: {
          include: {
            sku: {
              include: {
                product: {
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
            },
          },
        },
      },
    });
  }

  async findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
  }): Promise<IProductResponse[]> {
    const { category_id, category_slug, orderBy, take, languageCode = 'en' } = params;

    return this.prisma.product.findMany({
      where: {
        ...(category_id && {
          categories: {
            some: {
              category_id,
            },
          },
        }),
        ...(category_slug && {
          categories: {
            some: {
              category: {
                OR: [{ slug: category_slug }, { parent: { slug: category_slug } }],
              },
            },
          },
        }),
        deleted_at: null,
      },
      orderBy,
      take,
      include: this.getProductInclude(languageCode),
    });
  }

  async getRecentlyViewed(userId: string, take = 10, languageCode = 'en'): Promise<IProductResponse[]> {
    const whereHistory = { user_id: userId };
    const history = await this.prisma.userBrowsingHistory.findMany({
      where: whereHistory,
      orderBy: { viewed_at: 'desc' },
      take: take,
    });
    const productIds = [...new Set(history.map((h) => h.product_id))].filter(
      (id): id is string => typeof id === 'string',
    );

    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: this.getProductInclude(languageCode),
    });
  }

  async getSuperDeals(take = 12, languageCode = 'en'): Promise<IProductResponse[]> {
    return this.prisma.product.findMany({
      where: {
        deleted_at: null,
        status: 1,
        skus: {
          some: {
            original_price: { not: null },
          },
        },
      },
      take: take,
      orderBy: { created_at: 'desc' },
      include: this.getProductInclude(languageCode),
    });
  }

  async getNewArrivals(take = 12, languageCode = 'en'): Promise<IProductResponse[]> {
    return this.prisma.product.findMany({
      where: { deleted_at: null, status: 1 },
      orderBy: { created_at: 'desc' },
      take,
      include: this.getProductInclude(languageCode),
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

  async findPaginated(params: GetProductsDto): Promise<IPaginatedResult<IProductResponse>> {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      category_slug,
      brand_id,
      min_price,
      max_price,
      attribute_value_ids,
      languageCode = 'vi',
    } = params;

    const where: Prisma.ProductWhereInput = {
      deleted_at: null,
    };

    if (category_id) {
      where.categories = {
        some: {
          category_id,
        },
      };
    }

    if (category_slug) {
      const categoryIds = await this.getDescendantCategoryIds(category_slug);
      where.categories = {
        some: {
          category_id: { in: categoryIds },
        },
      };
    }

    if (brand_id) {
      where.brand_id = brand_id;
    }

    if (search) {
      where.translations = {
        some: {
          name: {
            contains: search,
          },
          language: {
            code: languageCode,
          },
        },
      };
    }

    if (min_price !== undefined || max_price !== undefined || (attribute_value_ids && attribute_value_ids.length > 0)) {
      where.skus = {
        some: {
          ...(min_price !== undefined && { price: { gte: min_price } }),
          ...(max_price !== undefined && { price: { lte: max_price } }),
          ...(attribute_value_ids &&
            attribute_value_ids.length > 0 && {
              sku_attribute_values: {
                some: {
                  attribute_value_id: { in: attribute_value_ids },
                },
              },
            }),
        },
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = { created_at: 'desc' };

    const result = await this.paginationService.paginate(
      this.prisma.product,
      {
        where,
        orderBy,
        include: this.getProductInclude(languageCode),
      },
      page,
      limit,
    );

    return result;
  }

  async getProductReviews(productId: string, page = 1, limit = 10): Promise<IPaginatedResult<IReviewResponse>> {
    const result = await this.paginationService.paginate(
      this.prisma.review,
      {
        where: { product_id: productId },
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, first_name: true, last_name: true },
          },
          sku: true,
        },
      },
      page,
      limit,
    );

    return result;
  }

  async getSimilarProducts(categoryId: string, limit = 4, languageCode = 'en'): Promise<IProductResponse[]> {
    return this.prisma.product.findMany({
      where: {
        categories: {
          some: { category_id: categoryId },
        },
        deleted_at: null,
        status: 1,
      },
      take: limit,
      include: this.getProductInclude(languageCode),
    });
  }

  async getProductCategories(productId: string): Promise<string[] | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        categories: {
          select: { category_id: true },
        },
      },
    });

    if (!product) return null;
    return product.categories.map((c) => c.category_id);
  }
}
