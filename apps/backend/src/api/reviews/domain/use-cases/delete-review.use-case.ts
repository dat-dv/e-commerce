import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(id: string, userId: string) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }

    const hasDeletePermission = await this.reviewsRepository.hasPermission(userId, 'DELETE:REVIEW');
    const isOwner = review.user_id === userId;

    // Check if user is owner or has permission
    if (!isOwner && !hasDeletePermission) {
      throw new UnauthorizedException('You are not allowed to delete this review');
    }
    return this.reviewsRepository.delete(id);
  }
}
