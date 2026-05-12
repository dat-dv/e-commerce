import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';

@Injectable()
export class GetProductDetailUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(id: string, languageCode = 'vi', userId?: string) {
    const product = await this.productsRepository.findById(id, languageCode);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (userId) {
      try {
        await this.productsRepository.recordView(userId, id);
      } catch (error) {
        console.error('Failed to record product view:', error);
      }
    }

    return product;
  }
}
