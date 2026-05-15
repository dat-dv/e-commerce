import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProductResponse } from '@ecommerce/shared';

@Injectable()
export class GetRecommendedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(limit: number, userId?: string, languageCode = 'vi'): Promise<IProductResponse[]> {
    return this.productsRepository.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
      languageCode,
    });
  }
}
