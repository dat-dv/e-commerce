import { IFlashSale } from './flash-sale.entity';
import { IProduct } from './product.entity';
import { IBrand } from 'src/api/homepage/domain/entities/homepage-section.entity';

export interface IProductsRepository {
  findById(id: string, languageCode?: string): Promise<IProduct | null>;

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

  getFeaturedBrands(take: number, languageCode?: string): Promise<IBrand[]>;

  findPaginated(params: {
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
  }>;
}

export const IProductsRepository = Symbol('IProductsRepository');
