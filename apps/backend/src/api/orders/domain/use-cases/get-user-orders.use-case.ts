import { Injectable, Inject } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, options: { status?: number[]; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { user_id: userId };
    if (status && status.length > 0) {
      where.status = { in: status };
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true, // Snapshot data is stored here
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
