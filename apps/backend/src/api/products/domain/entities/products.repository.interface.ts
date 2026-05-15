import { IProductResponse, IPaginatedResult, Review, IGetProductsParams, IFlashSaleResponse } from '@ecommerce/shared';

export interface IProductsRepository {
  findById(id: string, languageCode?: string): Promise<IProductResponse | null>;
  findBySlug(slug: string, languageCode?: string): Promise<IProductResponse | null>;
  recordView(userId: string, productId: string): Promise<void>;
  getUserTopCategory(userId: string): Promise<string | null>;
  getActiveFlashSale(languageCode?: string): Promise<IFlashSaleResponse | null>;
  findMany(params: {
    category_id?: string;
    category_slug?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
    languageCode?: string;
  }): Promise<IProductResponse[]>;
  getRecentlyViewed(userId: string, take?: number, languageCode?: string): Promise<IProductResponse[]>;
  getSuperDeals(take?: number, languageCode?: string): Promise<IProductResponse[]>;
  getNewArrivals(take?: number, languageCode?: string): Promise<IProductResponse[]>;
  findPaginated(params: IGetProductsParams): Promise<IPaginatedResult<IProductResponse>>;
  getProductReviews(productId: string, page?: number, limit?: number): Promise<IPaginatedResult<Review>>;
  getSimilarProducts(categoryId: string, limit?: number, languageCode?: string): Promise<IProductResponse[]>;
  getProductCategories(productId: string): Promise<string[] | null>;
}

export const IProductsRepository = Symbol('IProductsRepository');
