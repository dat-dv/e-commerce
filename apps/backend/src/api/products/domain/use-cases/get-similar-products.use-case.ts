import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetSimilarProductsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(productId: string, limit: number, languageCode = DEFAULT_LANGUAGE_CODE) {
    const categoryIds = await this.productsRepository.getProductCategories(productId);

    if (categoryIds === null) {
      throw new NotFoundException('Product not found');
    }

    if (categoryIds.length === 0) {
      return [];
    }

    const categoryId = categoryIds[0];

    return this.productsRepository.getSimilarProducts(categoryId, limit, languageCode);
  }
}
