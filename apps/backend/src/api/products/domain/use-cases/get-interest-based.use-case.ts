import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { Product } from '@ecommerce/shared';

@Injectable()
export class GetInterestBasedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(take: number, userId?: string): Promise<Product[]> {
    let basedOnInterest: Product[] = [];

    if (userId) {
      const topCategoryId = await this.productsRepository.getUserTopCategory(userId);
      if (topCategoryId) {
        basedOnInterest = await this.productsRepository.findMany({
          category_id: topCategoryId,
          orderBy: { sold_count: 'desc' },
          take: take,
        });
      }
    }

    if (basedOnInterest.length === 0) {
      basedOnInterest = await this.productsRepository.findMany({
        orderBy: { created_at: 'desc' },
        take: take,
      });
    }

    return basedOnInterest;
  }
}
