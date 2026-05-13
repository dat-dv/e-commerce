import { Injectable, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, userId: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sku: {
              include: {
                product: {
                  include: {
                    thumbnail: true,
                  },
                },
              },
            },
          },
        },
        shipping_address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check ownership
    if (!isAdmin && order.user_id !== userId) {
      throw new UnauthorizedException('You are not allowed to view this order');
    }

    return order;
  }
}
