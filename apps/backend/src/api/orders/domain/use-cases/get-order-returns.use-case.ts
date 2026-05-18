import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { GetOrderReturnsDto } from '../../dto/get-order-returns.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class GetOrderReturnsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async execute(dto: GetOrderReturnsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const where: Prisma.OrderReturnWhereInput = {};
    if (dto.status !== undefined) {
      where.status = dto.status;
    }

    return this.paginationService.paginate(
      this.prisma.orderReturn as any,
      {
        where,
        orderBy: { created_at: 'desc' },
        include: {
          images: { include: { image: true } },
          order: {
            include: {
              user: {
                select: { id: true, email: true, first_name: true, last_name: true },
              },
            },
          },
          created_by: {
            select: { id: true, email: true, first_name: true, last_name: true },
          },
        },
      },
      page,
      limit,
    );
  }
}
