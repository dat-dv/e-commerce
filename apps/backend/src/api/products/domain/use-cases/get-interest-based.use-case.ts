import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProductResponse } from '@ecommerce/shared';

@Injectable()
export class GetInterestBasedUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(take: number, userId?: string, languageCode = 'en'): Promise<IProductResponse[]> {
    let basedOnInterest: IProductResponse[] = [];

    if (userId) {
      const topCategoryId = await this.productsRepository.getUserTopCategory(userId);
      if (topCategoryId) {
        basedOnInterest = await this.productsRepository.findMany({
          category_id: topCategoryId,
          orderBy: { sold_count: 'desc' },
          take: take,
          languageCode,
        });
      }
    }

    if (basedOnInterest.length === 0) {
      basedOnInterest = await this.productsRepository.findMany({
        orderBy: { created_at: 'desc' },
        take: take,
        languageCode,
      });
    }

    return basedOnInterest;
  }
}
