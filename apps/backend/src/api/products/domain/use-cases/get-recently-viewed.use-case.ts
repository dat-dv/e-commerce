import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProductResponse } from '@ecommerce/shared';

@Injectable()
export class GetRecentlyViewedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(userId: string, limit = 10, languageCode = 'vi'): Promise<IProductResponse[]> {
    return this.productsRepository.getRecentlyViewed(userId, limit, languageCode);
  }
}
