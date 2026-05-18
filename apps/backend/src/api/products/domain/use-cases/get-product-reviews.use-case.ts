import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { GetProductReviewsDto } from '../../dto/get-product-reviews.dto';

@Injectable()
export class GetProductReviewsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(productId: string, params: GetProductReviewsDto = {}) {
    return this.productsRepository.getProductReviews(productId, params);
  }
}
