import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';

@Injectable()
export class GetProductReviewsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(productId: string, page = 1, limit = 10) {
    return this.productsRepository.getProductReviews(productId, page, limit);
  }
}
