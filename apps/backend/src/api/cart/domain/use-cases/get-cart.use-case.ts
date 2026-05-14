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
    const now = new Date();
    const cartData = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            sku: {
              include: {
                product: {
                  include: {
                    translations: {
                      where: { language: { code: lang } },
                    },
                  },
                },
                flash_sales: {
                  where: {
                    flash_sale: {
                      start_time: { lte: now },
                      end_time: { gte: now },
                    },
                    stock: { gt: 0 },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cartData) {
      const newCart = await this.cartRepository.createCart(userId);
      return { ...newCart, items: [] };
    }

    return {
      ...cartData,
      items: cartData.items.map((item) => ({
        ...item,
        sku: {
          ...item.sku,
          price: Number(item.sku.price),
          original_price: item.sku.original_price ? Number(item.sku.original_price) : null,
          flash_sales: item.sku.flash_sales.map((fs) => ({
            ...fs,
            sale_price: Number(fs.sale_price),
          })),
        },
      })),
    };
  }
}
