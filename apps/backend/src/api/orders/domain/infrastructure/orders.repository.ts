import { Injectable } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderStatus } from '../entities/order-status.enum';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: {
    user_id: string;
    total_amount: number;
    shipping_address_id?: string;
    items: { sku_id: string; quantity: number; price: number }[];
  }) {
    return this.prisma.order.create({
      data: {
        user_id: data.user_id,
        total_amount: data.total_amount,
        shipping_address_id: data.shipping_address_id,
        items: {
          create: data.items.map((item) => ({
            sku_id: item.sku_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  async getOrder(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: string, status: number) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async cancelOrder(id: string, userId: string) {
    return this.prisma.order.update({
      where: { id, user_id: userId },
      data: { status: OrderStatus.CANCELLED }, // 5: CANCELLED
    });
  }
}
