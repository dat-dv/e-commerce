import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProduct } from '@ecommerce/shared';

@Injectable()
export class GetRecentlyViewedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(userId: string, limit = 10, languageCode = 'vi'): Promise<IProduct[]> {
    return this.productsRepository.getRecentlyViewed(userId, limit, languageCode);
  }
}
