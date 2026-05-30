import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductResponse } from '@ecommerce/shared';
import { IProductsRepository } from '../entities/products.repository.interface';
import { UpdateProductDto } from '../../dto/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(id: string, data: UpdateProductDto): Promise<IProductResponse> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productsRepository.update(id, data);
  }
}
