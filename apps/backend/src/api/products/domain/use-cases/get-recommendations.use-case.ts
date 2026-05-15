import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { Product } from '@ecommerce/shared';

@Injectable()
export class GetRecommendationsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(userId?: string) {
    const recommended = await this.productsRepository.findMany({
      orderBy: { sold_count: 'desc' },
      take: 24,
    });

    let basedOnInterest: Product[] = [];

    if (userId) {
      const topCategoryId = await this.productsRepository.getUserTopCategory(userId);
      if (topCategoryId) {
        basedOnInterest = await this.productsRepository.findMany({
          category_id: topCategoryId,
          orderBy: { sold_count: 'desc' },
          take: 4,
        });
      }
    }

    if (basedOnInterest.length === 0) {
      basedOnInterest = await this.productsRepository.findMany({
        orderBy: { created_at: 'desc' },
        take: 4,
      });
    }

    return {
      recommended,
      basedOnInterest,
    };
  }
}
