import type { IReviewResponse, IReviewListResponse } from '@ecommerce/shared';
import { CreateReviewInputDto } from '../../dto/create-review-input.dto';
import { UpdateReviewDto } from '../../dto/update-review.dto';

export interface IReviewsRepository {
  create(data: CreateReviewInputDto): Promise<IReviewResponse>;
  update(id: string, data: UpdateReviewDto): Promise<IReviewResponse>;
  findAll(): Promise<IReviewListResponse>;
  findByProduct(productId: string): Promise<IReviewListResponse>;
  delete(id: string): Promise<IReviewResponse>;
  findById(id: string): Promise<IReviewResponse | null>;
  isSkuInProduct(productId: string, skuId: string): Promise<boolean>;
  hasDeliveredPurchase(userId: string, productId: string, skuId: string): Promise<boolean>;
  isUserAdmin(userId: string): Promise<boolean>;
  hasPermission(userId: string, permissionName: string): Promise<boolean>;
}

export const IReviewsRepository = Symbol('IReviewsRepository');
