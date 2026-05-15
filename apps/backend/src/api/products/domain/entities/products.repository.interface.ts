import { Product, IPaginatedResult, Review, IGetProductsParams } from '@ecommerce/shared';
import { Prisma } from '../../../../../generated/prisma/client';

export type FlashSaleWithProducts = Prisma.FlashSaleGetPayload<{
  include: {
    products: {
      include: {
        sku: {
          include: {
            product: {
              include: { translations: true; skus: true };
            };
          };
        };
      };
    };
  };
}>;

export interface IProductsRepository {
  findById(id: string, languageCode?: string): Promise<Product | null>;
  findBySlug(slug: string, languageCode?: string): Promise<Product | null>;
  recordView(userId: string, productId: string): Promise<void>;
  getUserTopCategory(userId: string): Promise<string | null>;
  getActiveFlashSale(languageCode?: string): Promise<FlashSaleWithProducts | null>;
  findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
  }): Promise<Product[]>;
  getRecentlyViewed(userId: string, take?: number, languageCode?: string): Promise<Product[]>;
  getSuperDeals(take?: number, languageCode?: string): Promise<Product[]>;
  getNewArrivals(take?: number, languageCode?: string): Promise<Product[]>;
  findPaginated(params: IGetProductsParams): Promise<IPaginatedResult<Product>>;
  getProductReviews(productId: string, page?: number, limit?: number): Promise<IPaginatedResult<Review>>;
  getSimilarProducts(categoryId: string, limit?: number, languageCode?: string): Promise<Product[]>;
  getProductCategories(productId: string): Promise<string[] | null>;
}

export const IProductsRepository = Symbol('IProductsRepository');
