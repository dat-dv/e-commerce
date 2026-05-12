import { Review } from 'generated/prisma/client';

export interface IReviewsRepository {
  create(data: {
    product_id: string;
    sku_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    images?: string[];
  }): Promise<Review>;
  update(id: string, data: { rating?: number; comment?: string; images?: string[] }): Promise<Review>;
  findAll(): Promise<Review[]>;
  findByProduct(productId: string): Promise<Review[]>;
  delete(id: string): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  isUserAdmin(userId: string): Promise<boolean>;
  hasPermission(userId: string, permissionName: string): Promise<boolean>;
}

export const IReviewsRepository = Symbol('IReviewsRepository');
