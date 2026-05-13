import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IFlashSale } from '@ecommerce/shared';

@Injectable()
export class GetFlashSaleUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(languageCode = 'vi') {
    const flashSale = await this.productsRepository.getActiveFlashSale();

    if (!flashSale) {
      return null;
    }

    return flashSale;
  }
}
