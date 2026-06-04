import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IPaginatedResult, IProductResponse } from '@ecommerce/shared';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetFlashSaleUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(
    languageCode = DEFAULT_LANGUAGE_CODE,
    userId?: string,
    page = 1,
    limit = 12,
  ): Promise<IPaginatedResult<IProductResponse>> {
    return this.productsRepository.getActiveFlashSaleProductsPaginated({
      page,
      limit,
      languageCode,
      userId,
    });
  }
}
