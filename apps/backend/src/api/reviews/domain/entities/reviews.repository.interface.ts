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
  isUserAdmin(userId: string): Promise<boolean>;
  hasPermission(userId: string, permissionName: string): Promise<boolean>;
}

export const IReviewsRepository = Symbol('IReviewsRepository');
