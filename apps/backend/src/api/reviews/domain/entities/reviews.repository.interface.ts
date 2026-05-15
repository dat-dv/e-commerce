import type { IReviewResponse, IReviewListResponse } from '@ecommerce/shared';

export interface IReviewsRepository {
  create(data: {
    product_id: string;
    sku_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    images?: string[];
  }): Promise<IReviewResponse>;
  update(id: string, data: { rating?: number; comment?: string; images?: string[] }): Promise<IReviewResponse>;
  findAll(): Promise<IReviewListResponse>;
  findByProduct(productId: string): Promise<IReviewListResponse>;
  delete(id: string): Promise<IReviewResponse>;
  findById(id: string): Promise<IReviewResponse | null>;
  isUserAdmin(userId: string): Promise<boolean>;
  hasPermission(userId: string, permissionName: string): Promise<boolean>;
}

export const IReviewsRepository = Symbol('IReviewsRepository');
