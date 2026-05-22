import { IFlashSaleResponse, IPaginatedResult, IProductResponse, Review } from '@ecommerce/shared';
import { GetProductReviewsDto } from '../../dto/get-product-reviews.dto';
import { GetProductsDto } from '../../dto/get-products.dto';

export interface IProductsRepository {
  findById(id: string): Promise<IProductResponse | null>;
  findBySlug(slug: string): Promise<IProductResponse | null>;
  recordView(userId: string, productId: string): Promise<void>;
  getUserTopCategory(userId: string): Promise<string | null>;
  getActiveFlashSale(userId?: string): Promise<IFlashSaleResponse | null>;
  getActiveFlashSaleProductsPaginated(params: {
    page?: number;
    limit?: number;
    userId?: string;
  }): Promise<IPaginatedResult<IProductResponse>>;
  findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    userId?: string;
  }): Promise<IProductResponse[]>;
  getRecentlyViewed(userId: string, take?: number): Promise<IProductResponse[]>;
  getRecentlyViewedPaginated(params: {
    userId: string;
    page?: number;
    limit?: number;
  }): Promise<IPaginatedResult<IProductResponse>>;
  getSuperDeals(take?: number, serId?: string): Promise<IProductResponse[]>;
  getNewArrivals(take?: number, serId?: string): Promise<IProductResponse[]>;
  findPaginated(params: GetProductsDto): Promise<IPaginatedResult<IProductResponse>>;
  getProductReviews(productId: string, params?: GetProductReviewsDto): Promise<IPaginatedResult<Review>>;
  getSimilarProducts(categoryId: string, limit?: number): Promise<IProductResponse[]>;
  getProductCategories(productId: string): Promise<string[] | null>;
  isFavorited(userId: string, productId: string): Promise<boolean>;
}

export const IProductsRepository = Symbol('IProductsRepository');
