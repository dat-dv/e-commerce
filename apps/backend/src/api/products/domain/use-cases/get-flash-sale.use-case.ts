import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';

@Injectable()
export class GetFlashSaleUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute() {
    const flashSale = await this.productsRepository.getActiveFlashSale();

    if (!flashSale) {
      return [];
    }

    // Format lại dữ liệu trả về cho đẹp và khớp với UI
    return {
      id: flashSale.id,
      name: flashSale.name,
      end_time: flashSale.end_time,
      products: flashSale.products.map((fp) => ({
        id: fp.product.id,
        name: fp.product.name,
        slug: fp.product.slug,
        price: fp.product.price, // Giá gốc
        sale_price: fp.sale_price, // Giá flash sale
        discount_percentage: Math.round(((fp.product.price - fp.sale_price) / fp.product.price) * 100),
        sold: fp.sold_count,
        stock_left: fp.stock,
      })),
    };
  }
}
