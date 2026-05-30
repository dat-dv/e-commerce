import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IPaginatedResult, IProductResponse } from '@ecommerce/shared';

@Injectable()
export class GetRecommendedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(
    page = 1,
    limit = 15,
    user_id?: string,
    languageCode = 'en',
  ): Promise<IPaginatedResult<IProductResponse>> {
    return this.productsRepository.findPaginated({
      page,
      limit,
      languageCode,
      user_id,
    });
  }
}
