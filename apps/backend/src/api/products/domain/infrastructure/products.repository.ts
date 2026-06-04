import {
  EProductSort,
  IFlashSaleResponse,
  IPaginatedResult,
  IProductResponse,
  Review as IReviewResponse,
} from '@ecommerce/shared';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { GetProductReviewsDto, PRODUCT_REVIEW_SORT } from '../../dto/get-product-reviews.dto';
import { GetProductsDto } from '../../dto/get-products.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { IProductsRepository } from '../entities/products.repository.interface';
import { ProductSearchService } from './product-search.service';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  private readonly logger = new Logger(ProductsRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly productSearchService: ProductSearchService,
  ) {}

  private getProductInclude(languageCode: string, options?: { allTranslations?: boolean }) {
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
      translations: options?.allTranslations
        ? true
        : {
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
          flash_sales: {
            where: {
              flash_sale: {
                start_time: { lte: new Date() },
                end_time: { gte: new Date() },
              },
            },
            include: {
              flash_sale: true,
            },
          },
        },
      },
    };
  }

  async findById(
    id: string,
    languageCode = DEFAULT_LANGUAGE_CODE,
    options?: { allTranslations?: boolean },
  ): Promise<IProductResponse | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: this.getProductInclude(languageCode, options),
    });
  }

  async findBySlug(
    slug: string,
    languageCode = DEFAULT_LANGUAGE_CODE,
    options?: { allTranslations?: boolean },
  ): Promise<IProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: this.getProductInclude(languageCode, options),
    });

    if (!product) {
      return this.findById(slug, languageCode, options);
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

  async getActiveFlashSale(languageCode = DEFAULT_LANGUAGE_CODE, userId?: string): Promise<IFlashSaleResponse | null> {
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
                    ...this.getProductInclude(languageCode),
                    favorited_by_users: userId
                      ? {
                          where: {
                            user_id: userId,
                          },
                          select: {
                            product_id: true,
                          },
                        }
                      : false,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!flashSale) return null;

    const products = flashSale.products.map((p) => {
      const flashSaleSku = {
        ...p.sku,
        flash_sales: [
          {
            ...p,
            flash_sale: flashSale,
          },
        ],
      };

      return {
        ...p,
        sku: {
          ...flashSaleSku,
          product: {
            ...p.sku.product,
            skus: [flashSaleSku],
            is_favorited: userId ? p.sku.product.favorited_by_users?.length > 0 : false,
          },
        },
      };
    });

    return {
      ...flashSale,
      products,
    };
  }

  async getActiveFlashSaleProductsPaginated(params: {
    page?: number;
    limit?: number;
    languageCode?: string;
    userId?: string;
  }): Promise<IPaginatedResult<IProductResponse>> {
    const { page = 1, limit = 12, languageCode = DEFAULT_LANGUAGE_CODE, userId } = params;
    const now = new Date();
    const flashSale = await this.prisma.flashSale.findFirst({
      where: {
        start_time: { lte: now },
        end_time: { gte: now },
      },
    });

    if (!flashSale) {
      return {
        items: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.flashSaleProduct.findMany({
        where: { flash_sale_id: flashSale.id },
        skip,
        take: limit,
        include: {
          sku: {
            include: {
              product: {
                include: {
                  ...this.getProductInclude(languageCode),
                  favorited_by_users: userId
                    ? {
                        where: {
                          user_id: userId,
                        },
                        select: {
                          product_id: true,
                        },
                      }
                    : false,
                },
              },
            },
          },
          flash_sale: true,
        },
      }),
      this.prisma.flashSaleProduct.count({
        where: { flash_sale_id: flashSale.id },
      }),
    ]);

    return {
      items: items.map((flashSaleProduct) => {
        const flashSaleSku = {
          ...flashSaleProduct.sku,
          flash_sales: [flashSaleProduct],
        };

        return {
          ...flashSaleProduct.sku.product,
          skus: [flashSaleSku],
          is_favorited: userId ? flashSaleProduct.sku.product.favorited_by_users?.length > 0 : false,
        };
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async attachFavoriteStatus(products: IProductResponse[], userId?: string): Promise<IProductResponse[]> {
    if (!userId || products.length === 0) {
      return products.map((p) => ({ ...p, is_favorited: false }));
    }

    const productIds = products.map((p) => p.id);
    const favorites = await this.prisma.userFavoriteProduct.findMany({
      where: {
        user_id: userId,
        product_id: { in: productIds },
      },
      select: { product_id: true },
    });

    const favoriteSet = new Set(favorites.map((f) => f.product_id));

    return products.map((p) => ({
      ...p,
      is_favorited: favoriteSet.has(p.id),
    }));
  }

  async findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
    userId?: string;
  }): Promise<IProductResponse[]> {
    const { category_id, category_slug, orderBy, take, languageCode = DEFAULT_LANGUAGE_CODE, userId } = params;

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
      include: this.getProductInclude(languageCode),
    });

    return this.attachFavoriteStatus(products, userId);
  }

  async getRecentlyViewed(
    userId: string,
    take = 10,
    languageCode = DEFAULT_LANGUAGE_CODE,
  ): Promise<IProductResponse[]> {
    const whereHistory = { user_id: userId };
    const history = await this.prisma.userBrowsingHistory.findMany({
      where: whereHistory,
      orderBy: { viewed_at: 'desc' },
      take: take,
    });
    const productIds = [...new Set(history.map((h) => h.product_id))].filter(
      (id): id is string => typeof id === 'string',
    );

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: this.getProductInclude(languageCode),
    });

    return this.attachFavoriteStatus(products, userId);
  }

  async getRecentlyViewedPaginated(params: {
    userId: string;
    page?: number;
    limit?: number;
    languageCode?: string;
  }): Promise<IPaginatedResult<IProductResponse>> {
    const { userId, page = 1, limit = 10, languageCode = DEFAULT_LANGUAGE_CODE } = params;
    const history = await this.prisma.userBrowsingHistory.findMany({
      where: { user_id: userId },
      orderBy: { viewed_at: 'desc' },
      select: { product_id: true },
    });
    const productIds = [...new Set(history.map((h) => h.product_id))].filter(
      (id): id is string => typeof id === 'string',
    );
    const total = productIds.length;
    const paginatedIds = productIds.slice((page - 1) * limit, page * limit);

    if (paginatedIds.length === 0) {
      return {
        items: [],
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: paginatedIds } },
      include: this.getProductInclude(languageCode),
    });
    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderedProducts = paginatedIds.flatMap((id) => {
      const product = productMap.get(id);
      return product ? [product] : [];
    });

    return {
      items: await this.attachFavoriteStatus(orderedProducts, userId),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSuperDeals(take = 12, languageCode = DEFAULT_LANGUAGE_CODE, userId?: string): Promise<IProductResponse[]> {
    const products = await this.prisma.product.findMany({
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

    return this.attachFavoriteStatus(products, userId);
  }

  async getNewArrivals(take = 12, languageCode = DEFAULT_LANGUAGE_CODE, userId?: string): Promise<IProductResponse[]> {
    const products = await this.prisma.product.findMany({
      where: { deleted_at: null, status: 1 },
      orderBy: { created_at: 'desc' },
      take,
      include: this.getProductInclude(languageCode),
    });

    return this.attachFavoriteStatus(products, userId);
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
      rating,
      attribute_value_ids,
      sort,
      languageCode = DEFAULT_LANGUAGE_CODE,
      user_id,
    } = params;

    const searchResult = await this.findPaginatedWithMeilisearch(params);
    if (searchResult) {
      return searchResult;
    }

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

    if (rating !== undefined) {
      where.rating = { gte: rating };
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

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === EProductSort.PRICE_ASC
        ? { base_price: 'asc' }
        : sort === EProductSort.PRICE_DESC
          ? { base_price: 'desc' }
          : sort === EProductSort.BUY_MOST
            ? { sold_count: 'desc' }
            : sort === EProductSort.BUY_LESS
              ? { sold_count: 'asc' }
              : { created_at: 'desc' };

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

    result.items = await this.attachFavoriteStatus(result.items, user_id);

    return result;
  }

  private async findPaginatedWithMeilisearch(
    params: GetProductsDto,
  ): Promise<IPaginatedResult<IProductResponse> | null> {
    if (!this.productSearchService.isEnabled()) {
      return null;
    }

    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const languageCode = params.languageCode ?? DEFAULT_LANGUAGE_CODE;

    try {
      const searchResult = await this.productSearchService.searchProducts(params);

      if (!searchResult) return null;

      if (searchResult.ids.length === 0) {
        return {
          items: [],
          meta: {
            total: searchResult.total,
            page,
            limit,
            totalPages: Math.ceil(searchResult.total / limit),
          },
        };
      }

      const products = await this.prisma.product.findMany({
        where: {
          id: { in: searchResult.ids },
          deleted_at: null,
        },
        include: this.getProductInclude(languageCode),
      });
      const productMap = new Map(products.map((product) => [product.id, product]));
      const orderedProducts = searchResult.ids.flatMap((id) => {
        const product = productMap.get(id);
        return product ? [product] : [];
      });

      return {
        items: await this.attachFavoriteStatus(orderedProducts, params.user_id),
        meta: {
          total: searchResult.total,
          page,
          limit,
          totalPages: Math.ceil(searchResult.total / limit),
        },
      };
    } catch (error) {
      this.logger.warn(`Meilisearch product listing failed, falling back to Prisma: ${(error as Error).message}`);
      return null;
    }
  }

  async getProductReviews(
    productId: string,
    params: GetProductReviewsDto = {},
  ): Promise<IPaginatedResult<IReviewResponse>> {
    const { page = 1, limit = 10, rating, has_images, sort = PRODUCT_REVIEW_SORT.NEWEST } = params;
    const where: Prisma.ReviewWhereInput = {
      product_id: productId,
      ...(rating && { rating }),
      ...(has_images === true && {
        AND: [{ images: { not: Prisma.DbNull } }, { images: { not: [] } }],
      }),
      ...(has_images === false && {
        OR: [{ images: { equals: Prisma.DbNull } }, { images: { equals: [] } }],
      }),
    };
    const orderBy: Prisma.ReviewOrderByWithRelationInput =
      sort === PRODUCT_REVIEW_SORT.OLDEST
        ? { created_at: 'asc' }
        : sort === PRODUCT_REVIEW_SORT.RATING_DESC
          ? { rating: 'desc' }
          : sort === PRODUCT_REVIEW_SORT.RATING_ASC
            ? { rating: 'asc' }
            : { created_at: 'desc' };

    const result = await this.paginationService.paginate(
      this.prisma.review,
      {
        where,
        orderBy,
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

  async getSimilarProducts(
    categoryId: string,
    limit = 4,
    languageCode = DEFAULT_LANGUAGE_CODE,
    userId?: string,
  ): Promise<IProductResponse[]> {
    const products = await this.prisma.product.findMany({
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

    return this.attachFavoriteStatus(products, userId);
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

  async isFavorited(userId: string, productId: string): Promise<boolean> {
    const count = await this.prisma.userFavoriteProduct.count({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
    return count > 0;
  }

  async getFavoriteProductIds(userId: string, productIds: string[]): Promise<string[]> {
    if (!productIds.length) return [];
    const favorites = await this.prisma.userFavoriteProduct.findMany({
      where: {
        user_id: userId,
        product_id: { in: productIds },
      },
      select: { product_id: true },
    });
    return favorites.map((f) => f.product_id);
  }

  async update(id: string, data: UpdateProductDto, languageCode = DEFAULT_LANGUAGE_CODE): Promise<IProductResponse> {
    const { translations, skus, category_ids, deleted_sku_ids, ...productData } = data;

    const updatedProduct = await this.prisma.$transaction(async (tx) => {
      if (productData.brand_id) {
        const brand = await tx.brand.findUnique({
          where: { id: productData.brand_id },
          select: { id: true },
        });

        if (!brand) {
          throw new BadRequestException('Selected brand does not exist');
        }
      }

      if (productData.thumbnail_id) {
        const image = await tx.image.findUnique({
          where: { id: productData.thumbnail_id },
          select: { id: true },
        });

        if (!image) {
          throw new BadRequestException('Selected thumbnail image does not exist');
        }
      }

      if (category_ids) {
        if (category_ids.length === 0) {
          throw new BadRequestException('Product must have at least one category');
        }

        const categories = await tx.productCategory.findMany({
          where: { id: { in: category_ids }, is_active: true },
          select: { id: true },
        });
        const foundCategoryIds = new Set(categories.map((category) => category.id));
        const missingCategoryIds = category_ids.filter((categoryId) => !foundCategoryIds.has(categoryId));

        if (missingCategoryIds.length > 0) {
          throw new BadRequestException('One or more selected categories do not exist or are inactive');
        }
      }

      if (translations && translations.length > 0) {
        const languageIds = [...new Set(translations.map((translation) => translation.language_id))];
        const languages = await tx.language.findMany({
          where: { id: { in: languageIds } },
          select: { id: true },
        });
        const foundLanguageIds = new Set(languages.map((language) => language.id));
        const missingLanguageIds = languageIds.filter((languageId) => !foundLanguageIds.has(languageId));

        if (missingLanguageIds.length > 0) {
          throw new BadRequestException('One or more selected languages do not exist');
        }
      }

      const skuIds = skus?.map((sku) => sku.id).filter((skuId): skuId is string => Boolean(skuId)) ?? [];
      const deletedSkuIds = deleted_sku_ids ?? [];
      const touchedSkuIds = [...new Set([...skuIds, ...deletedSkuIds])];

      if (touchedSkuIds.length > 0) {
        const productSkus = await tx.sku.findMany({
          where: {
            id: { in: touchedSkuIds },
            product_id: id,
          },
          select: { id: true },
        });
        const productSkuIds = new Set(productSkus.map((sku) => sku.id));
        const invalidSkuIds = touchedSkuIds.filter((skuId) => !productSkuIds.has(skuId));

        if (invalidSkuIds.length > 0) {
          throw new BadRequestException('One or more SKUs do not belong to this product');
        }
      }

      if (deletedSkuIds.length > 0) {
        const [orderItemCount, cartItemCount] = await Promise.all([
          tx.orderItem.count({ where: { sku_id: { in: deletedSkuIds } } }),
          tx.cartItem.count({ where: { sku_id: { in: deletedSkuIds } } }),
        ]);

        if (orderItemCount > 0 || cartItemCount > 0) {
          throw new BadRequestException('Cannot remove SKUs that are used in orders or carts');
        }
      }

      if (skus) {
        const remainingExistingSkuCount = await tx.sku.count({
          where: {
            product_id: id,
            id: deletedSkuIds.length > 0 ? { notIn: deletedSkuIds } : undefined,
          },
        });
        const newSkuCount = skus.filter((sku) => !sku.id).length;

        if (remainingExistingSkuCount + newSkuCount === 0) {
          throw new BadRequestException('Product must have at least one SKU');
        }

        const attributeValueIds = [...new Set(skus.flatMap((sku) => sku.attribute_value_ids ?? []))];

        if (attributeValueIds.length > 0) {
          const attributeValues = await tx.attributeValue.findMany({
            where: { id: { in: attributeValueIds } },
            select: { id: true },
          });
          const foundAttributeValueIds = new Set(attributeValues.map((value) => value.id));
          const missingAttributeValueIds = attributeValueIds.filter((valueId) => !foundAttributeValueIds.has(valueId));

          if (missingAttributeValueIds.length > 0) {
            throw new BadRequestException('One or more SKU attribute values do not exist');
          }
        }
      }

      // 1. Update basic product properties
      await tx.product.update({
        where: { id },
        data: {
          ...productData,
          ...(category_ids && {
            categories: {
              deleteMany: {},
              createMany: {
                data: category_ids.map((catId) => ({
                  category_id: catId,
                })),
              },
            },
          }),
        },
      });

      // 2. Handle translations (upsert name & description)
      if (translations && translations.length > 0) {
        for (const t of translations) {
          await tx.productTranslation.upsert({
            where: {
              product_id_language_id: {
                product_id: id,
                language_id: t.language_id,
              },
            },
            update: {
              name: t.name,
              description: t.description,
            },
            create: {
              product_id: id,
              language_id: t.language_id,
              name: t.name,
              description: t.description,
            },
          });
        }
      }

      // 3. Remove skus that are safe to delete
      if (deletedSkuIds.length > 0) {
        await tx.sku.deleteMany({
          where: {
            id: { in: deletedSkuIds },
            product_id: id,
          },
        });
      }

      // 4. Handle skus (update or insert)
      if (skus && skus.length > 0) {
        for (const sku of skus) {
          if (sku.id) {
            await tx.sku.update({
              where: { id: sku.id },
              data: {
                sku_code: sku.sku_code,
                price: sku.price,
                original_price: sku.original_price,
                stock: sku.stock,
                image_url: sku.image_url,
                unit_price: sku.unit_price,
              },
            });

            if (sku.attribute_value_ids) {
              await tx.skuAttributeValue.deleteMany({
                where: { sku_id: sku.id },
              });
              if (sku.attribute_value_ids.length > 0) {
                await tx.skuAttributeValue.createMany({
                  data: sku.attribute_value_ids.map((attributeValueId) => ({
                    sku_id: sku.id as string,
                    attribute_value_id: attributeValueId,
                  })),
                });
              }
            }
          } else {
            const createdSku = await tx.sku.create({
              data: {
                product_id: id,
                sku_code: sku.sku_code,
                price: sku.price,
                original_price: sku.original_price,
                stock: sku.stock,
                image_url: sku.image_url,
                unit_price: sku.unit_price,
              },
            });

            if (sku.attribute_value_ids && sku.attribute_value_ids.length > 0) {
              await tx.skuAttributeValue.createMany({
                data: sku.attribute_value_ids.map((attributeValueId) => ({
                  sku_id: createdSku.id,
                  attribute_value_id: attributeValueId,
                })),
              });
            }
          }
        }
      }

      const updatedProduct = await tx.product.findUnique({
        where: { id },
        include: this.getProductInclude(languageCode),
      });

      if (!updatedProduct) {
        throw new Error('Product not found after update');
      }

      return updatedProduct;
    });

    try {
      await this.productSearchService.syncProduct(id);
    } catch (error) {
      this.logger.warn(`Failed to sync product ${id} to Meilisearch: ${(error as Error).message}`);
    }

    return updatedProduct;
  }
}
