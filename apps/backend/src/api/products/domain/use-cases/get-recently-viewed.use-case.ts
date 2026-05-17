import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IPaginatedResult, IProductResponse } from '@ecommerce/shared';

@Injectable()
export class GetRecentlyViewedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(
    userId: string,
    page = 1,
    limit = 15,
    languageCode = 'vi',
  ): Promise<IPaginatedResult<IProductResponse>> {
    return this.productsRepository.getRecentlyViewedPaginated({
      userId,
      page,
      limit,
      languageCode,
    });
  }
}
