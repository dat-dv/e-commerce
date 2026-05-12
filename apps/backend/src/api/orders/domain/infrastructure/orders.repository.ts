import { Injectable } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderStatus } from '../entities/order-status.enum';
import { ICreateOrderInput, IOrder, IOrderItem } from '../entities/order.entity';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: ICreateOrderInput): Promise<IOrder> {
    const order = await this.prisma.order.create({
      data: {
        user_id: data.user_id,
        total_amount: data.total_amount,
        discount_amount: data.discount_amount,
        shipping_address_id: data.shipping_address_id,
        coupon_id: data.coupon_id,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map((item) => ({
            sku_id: item.sku_id,
            quantity: item.quantity,
            price: item.price,
            flash_sale_id: item.flash_sale_id,
          })),
        },
      },
      include: { items: true },
    });

    return order;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: { items: true },
    });
    return orders;
  }

  async updateStatus(id: string, status: number): Promise<IOrder> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return order;
  }

  async cancelOrder(id: string, userId: string): Promise<IOrder> {
    const order = await this.prisma.order.update({
      where: { id, user_id: userId },
      data: { status: OrderStatus.CANCELLED },
      include: { items: true },
    });
    return order;
  }
}
