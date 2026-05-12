import { Injectable, Inject } from '@nestjs/common';
import { ICartRepository } from '../entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, lang = 'vi') {
    const cart = await this.cartRepository.getCart(userId);

    if (!cart) {
      const newCart = await this.cartRepository.createCart(userId);
      return { ...newCart, items: [], total_amount: 0 };
    }

    if (cart.items.length === 0) {
      return { ...cart, total_amount: 0 };
    }

    const skuIds = cart.items.map((i) => i.sku_id);
    const now = new Date();

    // 1. Fetch tất cả SKU info trong 1 query
    const skus = await this.prisma.sku.findMany({
      where: { id: { in: skuIds } },
      include: {
        product: {
          include: {
            translations: {
              where: { language: { code: lang } },
            },
          },
        },
      },
    });

    // 2. Fetch tất cả Flash Sale đang active của các SKU này trong 1 query
    const activeFlashSales = await this.prisma.flashSaleProduct.findMany({
      where: {
        sku_id: { in: skuIds },
        stock: { gt: 0 },
        flash_sale: {
          start_time: { lte: now },
          end_time: { gte: now },
        },
      },
    });

    // Tạo Map để lookup nhanh (O(1))
    const skuMap = new Map(skus.map((s) => [s.id, s]));
    const flashSaleMap = new Map(activeFlashSales.map((fs) => [fs.sku_id, fs]));

    let totalAmount = 0;
    const itemsWithPrices = cart.items
      .map((item) => {
        const sku = skuMap.get(item.sku_id);
        if (!sku) return null;

        const flashSale = flashSaleMap.get(item.sku_id);

        const originalPrice = sku.price;
        const currentPrice = flashSale ? flashSale.sale_price : originalPrice;
        const isFlashSale = !!flashSale;

        totalAmount += currentPrice * item.quantity;

        return {
          ...item,
          product_name: sku.product.translations[0]?.name || 'Product',
          original_price: originalPrice,
          current_price: currentPrice,
          is_flash_sale: isFlashSale,
          subtotal: currentPrice * item.quantity,
          image_url: sku.image_url,
        };
      })
      .filter((i) => i !== null);

    return {
      ...cart,
      items: itemsWithPrices,
      total_amount: totalAmount,
    };
  }
}
