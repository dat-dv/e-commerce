import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProduct } from '../entities/product.entity';

@Injectable()
export class GetRecommendedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(limit: number): Promise<IProduct[]> {
    return this.productsRepository.findMany({
      orderBy: { sold_count: 'desc' },
      take: limit,
    });
  }
}
