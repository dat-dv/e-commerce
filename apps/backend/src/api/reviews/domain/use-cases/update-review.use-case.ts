import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';
import { UpdateReviewDto } from '../../dto/update-review.dto';

@Injectable()
export class UpdateReviewUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.reviewsRepository.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this review');
    }

    return this.reviewsRepository.update(id, dto);
  }
}
