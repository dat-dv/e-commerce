import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IFlashSale } from '../entities/flash-sale.entity';

@Injectable()
export class GetFlashSaleUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(languageCode = 'vi') {
    const flashSale = (await this.productsRepository.getActiveFlashSale()) as IFlashSale | null;

    if (!flashSale) {
      return [];
    }

    return {
      id: flashSale.id,
      name: flashSale.name,
      end_time: flashSale.end_time,
      products: flashSale.products.map((fp) => {
        const sku = fp.sku;
        const product = sku.product;
        const translation = product.translations?.[0];
        const originalPrice = sku.price;
        const salePrice = fp.sale_price;

        return {
          id: product.id,
          sku_id: sku.id,
          name: translation?.name || 'Sản phẩm không có tên',
          slug: product.id,
          price: originalPrice,
          sale_price: salePrice,
          discount_percentage: Math.round(((originalPrice - salePrice) / originalPrice) * 100),
          sold: fp.sold_count,
          stock_left: fp.stock,
        };
      }),
    };
  }
}
