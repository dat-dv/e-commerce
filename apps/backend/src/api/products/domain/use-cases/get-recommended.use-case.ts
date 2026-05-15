import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { Product } from '@ecommerce/shared';

@Injectable()
export class GetRecommendedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(limit: number): Promise<Product[]> {
    return this.productsRepository.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }
}
