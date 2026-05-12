import { Injectable, Inject } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';

@Injectable()
export class GetReviewsUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(productId?: string) {
    if (productId) {
      return this.reviewsRepository.findByProduct(productId);
    }
    return this.reviewsRepository.findAll();
  }
}
