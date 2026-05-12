import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProduct } from '../entities/product.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, languageCode = 'vi'): Promise<IProduct | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        thumbnail: true,
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
      },
    });

    return product;
  }

  async findMany(params: {
    category_id?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
  }): Promise<IProduct[]> {
    const { category_id, orderBy, take, languageCode = 'vi' } = params;

    const products = await this.prisma.product.findMany({
      where: {
        category_id,
        deleted_at: null,
      },
      orderBy,
      take,
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
        skus: true,
      },
    });

    return products;
  }

  async getUserTopCategory(userId: string): Promise<string | null> {
    const history = await (this.prisma.userBrowsingHistory.findMany({
      where: { user_id: userId },
      select: { product_id: true },
    }) as Promise<{ product_id: string }[]>);

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
      select: { category_id: true },
    });

    return product?.category_id || null;
  }

  async getActiveFlashSale(): Promise<any> {
    const now = new Date();
    const flashSale = await this.prisma.flashSale.findFirst({
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
                          code: 'vi', // Tạm thời mặc định 'vi'
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

    return flashSale;
  }

  async getRecentlyViewed(userId: string, take = 10, languageCode = 'vi'): Promise<IProduct[]> {
    const whereHistory = { user_id: userId };
    const history = await this.prisma.userBrowsingHistory.findMany({
      where: whereHistory,
      orderBy: { viewed_at: 'desc' },
      take: take,
    });

    const productIds = [...new Set(history.map((h) => h.product_id))].filter(
      (id): id is string => typeof id === 'string',
    );

    const fetchedProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
        skus: true,
      },
    });

    const productMap = new Map(fetchedProducts.map((p) => [p.id, p]));

    return productIds.map((id) => productMap.get(id)).filter((p) => p !== undefined);
  }

  async findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    category_id?: string;
    languageCode?: string;
  }): Promise<{
    data: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, search, category_id, languageCode = 'vi' } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deleted_at: null,
    };

    if (category_id) {
      where.category_id = category_id;
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

    const data = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        translations: {
          where: {
            language: {
              code: languageCode,
            },
          },
        },
        skus: true,
      },
    });

    const allProducts = await this.prisma.product.findMany({ where });
    const total = allProducts.length;

    const totalPages = Math.ceil(total / limit);

    return {
      data: data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
