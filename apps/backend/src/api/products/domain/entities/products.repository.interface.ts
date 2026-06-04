import { IFlashSaleResponse, IPaginatedResult, IProductResponse, Review } from '@ecommerce/shared';
import { GetProductReviewsDto } from '../../dto/get-product-reviews.dto';
import { GetProductsDto } from '../../dto/get-products.dto';

import { UpdateProductDto } from '../../dto/update-product.dto';

export interface IProductsRepository {
  findById(
    id: string,
    languageCode?: string,
    options?: { allTranslations?: boolean },
  ): Promise<IProductResponse | null>;
  findBySlug(
    slug: string,
    languageCode?: string,
    options?: { allTranslations?: boolean },
  ): Promise<IProductResponse | null>;
  recordView(userId: string, productId: string): Promise<void>;
  getUserTopCategory(userId: string): Promise<string | null>;
  getActiveFlashSale(languageCode?: string, userId?: string): Promise<IFlashSaleResponse | null>;
  getActiveFlashSaleProductsPaginated(params: {
    page?: number;
    limit?: number;
    languageCode?: string;
    userId?: string;
  }): Promise<IPaginatedResult<IProductResponse>>;
  findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
    userId?: string;
  }): Promise<IProductResponse[]>;
  getRecentlyViewed(userId: string, take?: number, languageCode?: string): Promise<IProductResponse[]>;
  getRecentlyViewedPaginated(params: {
    userId: string;
    page?: number;
    limit?: number;
    languageCode?: string;
  }): Promise<IPaginatedResult<IProductResponse>>;
  getSuperDeals(take?: number, languageCode?: string, userId?: string): Promise<IProductResponse[]>;
  getNewArrivals(take?: number, languageCode?: string, userId?: string): Promise<IProductResponse[]>;
  findPaginated(params: GetProductsDto): Promise<IPaginatedResult<IProductResponse>>;
  getProductReviews(productId: string, params?: GetProductReviewsDto): Promise<IPaginatedResult<Review>>;
  getSimilarProducts(categoryId: string, limit?: number, languageCode?: string): Promise<IProductResponse[]>;
  getProductCategories(productId: string): Promise<string[] | null>;
  isFavorited(userId: string, productId: string): Promise<boolean>;
  getFavoriteProductIds(userId: string, productIds: string[]): Promise<string[]>;
  update(id: string, data: UpdateProductDto, languageCode?: string): Promise<IProductResponse>;
}

export const IProductsRepository = Symbol('IProductsRepository');
