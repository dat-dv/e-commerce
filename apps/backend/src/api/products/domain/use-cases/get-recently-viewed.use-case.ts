import { IPaginatedResult, IProductResponse } from '@ecommerce/shared';
import { Inject, Injectable } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';

import { GetRecentlyViewedDto } from '../../dto/get-recently-viewed.dto';

@Injectable()
export class GetRecentlyViewedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(
    userId: string,
    query?: GetRecentlyViewedDto,
    languageCode = 'vi',
  ): Promise<IPaginatedResult<IProductResponse>> {
    const page = query?.page || 1;
    const limit = query?.limit || 15;
    return this.productsRepository.getRecentlyViewedPaginated({
      userId,
      page,
      limit,
      languageCode,
    });
  }
}
