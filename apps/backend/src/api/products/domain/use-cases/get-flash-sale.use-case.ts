import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IFlashSaleResponse } from '@ecommerce/shared';

@Injectable()
export class GetFlashSaleUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(languageCode = 'vi'): Promise<IFlashSaleResponse | null> {
    const flashSale = await this.productsRepository.getActiveFlashSale();

    if (!flashSale) {
      return null;
    }

    return flashSale;
  }
}
