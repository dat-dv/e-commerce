import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';

@Injectable()
export class GetSimilarProductsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(productId: string, limit = 4, languageCode = 'vi') {
    const product = await this.productsRepository.findById(productId, languageCode);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const categoryId = product.categories?.[0]?.category_id;
    if (!categoryId) {
      return [];
    }

    return this.productsRepository.getSimilarProducts(categoryId, limit, languageCode);
  }
}
