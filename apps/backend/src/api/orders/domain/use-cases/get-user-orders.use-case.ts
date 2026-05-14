import { Injectable, Inject } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        _count: {
          select: { items: true },
        },
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
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
