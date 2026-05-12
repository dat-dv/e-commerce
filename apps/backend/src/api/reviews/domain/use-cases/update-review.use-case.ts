import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';

@Injectable()
export class UpdateReviewUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(id: string, userId: string, data: { rating?: number; comment?: string; images?: string[] }) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }

    const hasUpdatePermission = await this.reviewsRepository.hasPermission(userId, 'UPDATE:REVIEW');
    const isOwner = review.user_id === userId;

    // Check if user is owner or has permission
    if (!isOwner && !hasUpdatePermission) {
      throw new UnauthorizedException('You are not allowed to update this review');
    }
    return this.reviewsRepository.update(id, data);
  }
}
