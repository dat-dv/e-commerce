import { IProduct } from './product.entity';

export interface IProductsRepository {
  findById(id: string): Promise<IProduct | null>;
  findMany(params: {
    category_id?: string;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
  }): Promise<IProduct[]>;
  getUserTopCategory(userId: string): Promise<string | null>;
  getActiveFlashSale(): Promise<{
    id: string;
    name: string;
    start_time: Date;
    end_time: Date;
    products: {
      sale_price: number;
      stock: number;
      sold_count: number;
      product: IProduct;
    }[];
  } | null>;

  getRecentlyViewed(userId: string, take?: number): Promise<IProduct[]>;

  findPaginated(params: { page: number; limit: number; search?: string; category_id?: string }): Promise<{
    data: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export const IProductsRepository = Symbol('IProductsRepository');
