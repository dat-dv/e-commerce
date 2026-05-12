import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProduct } from '../entities/product.entity';
import { IFlashSale } from '../entities/flash-sale.entity';
import { IBrand } from 'src/api/homepage/domain/entities/homepage-section.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, languageCode = 'en'): Promise<IProduct | null> {
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

    if (!product) return null;

    return {
      ...product,
      skus: product.skus?.map((sku) => ({
        ...sku,
        price: Number(sku.price),
        original_price: sku.original_price ? Number(sku.original_price) : null,
      })),
    };
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

  async getActiveFlashSale(languageCode = 'en'): Promise<IFlashSale | null> {
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

    if (!flashSale) return null;

    return {
      ...flashSale,
      products: flashSale.products.map((p) => ({
        ...p,
        sale_price: Number(p.sale_price),
        sku: {
          ...p.sku,
          price: Number(p.sku.price),
          original_price: p.sku.original_price ? Number(p.sku.original_price) : null,
        },
      })),
    };
  }

  async findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
  }): Promise<IProduct[]> {
    const { category_id, category_slug, orderBy, take, languageCode = 'en' } = params;

    const products = await this.prisma.product.findMany({
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

    return products.map((p) => ({
      ...p,
      skus: p.skus?.map((sku) => ({
        ...sku,
        price: Number(sku.price),
        original_price: sku.original_price ? Number(sku.original_price) : null,
      })),
    }));
  }

  async getRecentlyViewed(userId: string, take = 10, languageCode = 'en'): Promise<IProduct[]> {
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

    const productMap = new Map(
      fetchedProducts.map((p) => [
        p.id,
        {
          ...p,
          skus: p.skus?.map((sku) => ({
            ...sku,
            price: Number(sku.price),
            original_price: sku.original_price ? Number(sku.original_price) : null,
          })),
        },
      ]),
    );

    return productIds.map((id) => productMap.get(id)).filter((p) => p !== undefined);
  }

  async getSuperDeals(take = 12, languageCode = 'en'): Promise<IProduct[]> {
    const candidates = await this.prisma.product.findMany({
      where: {
        deleted_at: null,
        status: 1,
        skus: {
          some: {
            original_price: { not: null },
          },
        },
      },
      take: take * 5, // over-fetch; sort + slice below
      orderBy: { created_at: 'desc' },
      include: {
        thumbnail: true,
        translations: {
          where: { language: { code: languageCode } },
        },
        skus: true,
      },
    });

    // Sort by best discount % across any SKU
    const withDiscount = candidates
      .map((p) => {
        const bestDiscount = p.skus.reduce((max, sku) => {
          if (!sku.original_price || sku.original_price <= sku.price) return max;
          const pct = ((sku.original_price - sku.price) / sku.original_price) * 100;
          return pct > max ? pct : max;
        }, 0);
        return { product: p, bestDiscount };
      })
      .filter((x) => x.bestDiscount > 0)
      .sort((a, b) => b.bestDiscount - a.bestDiscount)
      .slice(0, take)
      .map(({ product: p }) => ({
        ...p,
        skus: p.skus.map((sku) => ({
          ...sku,
          price: Number(sku.price),
          original_price: sku.original_price ? Number(sku.original_price) : null,
        })),
      }));

    return withDiscount;
  }

  /** New Arrivals: most recently created active products. */
  async getNewArrivals(take = 12, languageCode = 'en'): Promise<IProduct[]> {
    const products = await this.prisma.product.findMany({
      where: { deleted_at: null, status: 1 },
      orderBy: { created_at: 'desc' },
      take,
      include: {
        thumbnail: true,
        translations: {
          where: { language: { code: languageCode } },
        },
        skus: true,
      },
    });

    return products.map((p) => ({
      ...p,
      skus: p.skus.map((sku) => ({
        ...sku,
        price: Number(sku.price),
        original_price: sku.original_price ? Number(sku.original_price) : null,
      })),
    }));
  }

  /** Featured Brands: is_featured=true brands with product count. */
  async getFeaturedBrands(take = 10, languageCode = 'en'): Promise<IBrand[]> {
    const brands = await this.prisma.brand.findMany({
      where: { is_featured: true },
      orderBy: { order: 'asc' },
      take,
      include: {
        translations: {
          where: { language: { code: languageCode } },
        },
        _count: { select: { products: true } },
      },
    });

    return brands.map((b) => {
      const translation = b.translations[0];
      return {
        id: b.id,
        slug: b.slug,
        logo_url: b.logo_url,
        website_url: b.website_url,
        is_verified: b.is_verified,
        is_featured: b.is_featured,
        order: b.order,
        name: translation?.name,
        description: translation?.description,
        product_count: b._count.products,
      };
    });
  }

  async findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    category_id?: string;
    brand_id?: string;
    min_price?: number;
    max_price?: number;
    attribute_value_ids?: string[];
    sort?: string;
    languageCode?: string;
  }): Promise<{
    data: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page,
      limit,
      search,
      category_id,
      brand_id,
      min_price,
      max_price,
      attribute_value_ids,
      sort,
      languageCode = 'en',
    } = params;
    const skip = (page - 1) * limit;

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

    let orderBy: Prisma.ProductOrderByWithRelationInput = { created_at: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { skus: { _count: 'asc' } };
    } else if (sort === 'price_desc') {
      orderBy = { skus: { _count: 'desc' } };
    }

    const data = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        thumbnail: true,
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

    const total = await this.prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((p) => ({
        ...p,
        skus: p.skus?.map((sku) => ({
          ...sku,
          price: Number(sku.price),
          original_price: sku.original_price ? Number(sku.original_price) : null,
        })),
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
