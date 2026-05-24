import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AddProductsToFlashSaleDto } from '../../dto/add-products-to-flash-sale.dto';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class AddProductsToFlashSaleUseCase {
  constructor(
    @Inject(IFlashSalesRepository)
    private readonly flashSalesRepository: IFlashSalesRepository,
  ) {}

  async execute(flashSaleId: string, dto: AddProductsToFlashSaleDto) {
    const flashSale = await this.flashSalesRepository.findFlashSaleById(flashSaleId);
    if (!flashSale) {
      throw new NotFoundException('Flash sale not found');
    }

    if (!dto.products || dto.products.length === 0) {
      throw new BadRequestException('Products list cannot be empty');
    }

    const existingSkuIds = new Set(flashSale.products.map((p) => p.sku_id));
    for (const product of dto.products) {
      if (existingSkuIds.has(product.sku_id)) {
        throw new BadRequestException(`Product SKU "${product.sku_id}" is already in this flash sale`);
      }
    }

    return this.flashSalesRepository.addProductsToFlashSale(flashSaleId, dto);
  }
}
