import { EProductSort, IFlashSale } from '@ecommerce/shared';
import { IProduct, IReview } from '@ecommerce/shared';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IProductsRepository {
  findById(id: string, languageCode?: string): Promise<IProduct | null>;

  findBySlug(slug: string, languageCode?: string): Promise<IProduct | null>;

  recordView(userId: string, productId: string): Promise<void>;

  findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
  }): Promise<IProduct[]>;

  getUserTopCategory(userId: string): Promise<string | null>;

  getActiveFlashSale(languageCode?: string): Promise<IFlashSale | null>;

  getRecentlyViewed(userId: string, take?: number, languageCode?: string): Promise<IProduct[]>;

  getSuperDeals(take: number, languageCode?: string): Promise<IProduct[]>;

  getNewArrivals(take: number, languageCode?: string): Promise<IProduct[]>;

  findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    category_id?: string;
    category_slug?: string;
    brand_id?: string;
    min_price?: number;
    max_price?: number;
    attribute_value_ids?: string[];
    sort?: EProductSort;
    languageCode?: string;
  }): Promise<PaginatedResult<IProduct>>;

  getProductReviews(productId: string, page?: number, limit?: number): Promise<PaginatedResult<IReview>>;

  getSimilarProducts(categoryId: string, limit?: number, languageCode?: string): Promise<IProduct[]>;
}

export const IProductsRepository = Symbol('IProductsRepository');
