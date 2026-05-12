import { Injectable, Inject } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { ICartRepository } from 'src/api/cart/domain/entities/cart.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, shippingAddressId?: string) {
    const cart = await this.cartRepository.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const skuIds = cart.items.map((item) => item.sku_id);
    const skus = await this.prisma.sku.findMany({
      where: { id: { in: skuIds } },
    });

    let totalAmount = 0;
    const orderItems = cart.items.map((cartItem) => {
      const sku = skus.find((s) => s.id === cartItem.sku_id);
      if (!sku) throw new Error(`SKU ${cartItem.sku_id} not found`);

      const price = sku.price;
      totalAmount += price * cartItem.quantity;

      return {
        sku_id: cartItem.sku_id,
        quantity: cartItem.quantity,
        price: price,
      };
    });

    const order = await this.ordersRepository.createOrder({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address_id: shippingAddressId,
      items: orderItems,
    });

    // Clear cart
    for (const item of cart.items) {
      await this.cartRepository.removeItem(item.id);
    }

    return order;
  }
}
