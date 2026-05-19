import { Injectable } from '@nestjs/common';
import { EOrderReturnStatus, EOrderStatus, IOrderReturnListResponse, IOrderReturnResponse } from '@ecommerce/shared';
import { Order, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateOrderReturnDto } from '../../dto/create-order-return.dto';
import { GetOrderReturnsDto } from '../../dto/get-order-returns.dto';
import { UpdateOrderReturnStatusDto } from '../../dto/update-order-return-status.dto';
import { IOrderReturnsRepository } from '../entities/order-returns.repository.interface';

const ORDER_RETURN_USER_SELECT = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
} satisfies Prisma.UserSelect;

const ORDER_RETURN_INCLUDE = {
  images: { include: { image: true } },
  order: {
    include: {
      user: { select: ORDER_RETURN_USER_SELECT },
    },
  },
  created_by: { select: ORDER_RETURN_USER_SELECT },
} satisfies Prisma.OrderReturnInclude;

const ORDER_STATUS_MAP: Partial<Record<EOrderReturnStatus, EOrderStatus>> = {
  [EOrderReturnStatus.PROCESSING]: EOrderStatus.RETURN_PROCESSING,
  [EOrderReturnStatus.APPROVED]: EOrderStatus.RETURNED,
  [EOrderReturnStatus.REJECTED]: EOrderStatus.RETURN_REJECTED,
  [EOrderReturnStatus.CANCELLED]: EOrderStatus.DELIVERED,
};

@Injectable()
export class OrderReturnsRepository implements IOrderReturnsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrderById(orderId: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  async findByOrderId(orderId: string): Promise<IOrderReturnResponse | null> {
    return this.prisma.orderReturn.findUnique({
      where: { order_id: orderId },
      include: ORDER_RETURN_INCLUDE,
    });
  }

  async findById(returnId: string): Promise<IOrderReturnResponse | null> {
    return this.prisma.orderReturn.findUnique({
      where: { id: returnId },
      include: ORDER_RETURN_INCLUDE,
    });
  }

  async create(orderId: string, userId: string, data: CreateOrderReturnDto): Promise<IOrderReturnResponse> {
    return this.prisma.$transaction(async (tx) => {
      const orderReturn = await tx.orderReturn.create({
        data: {
          order_id: orderId,
          title: data.title,
          description: data.description,
          status: EOrderReturnStatus.PENDING,
          created_by_id: userId,
          images:
            data.image_ids && data.image_ids.length > 0
              ? {
                  create: data.image_ids.map((id) => ({
                    image: { connect: { id } },
                  })),
                }
              : undefined,
        },
        include: ORDER_RETURN_INCLUDE,
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: EOrderStatus.RETURN_REQUESTED },
      });

      return orderReturn;
    });
  }

  async findAll(params: GetOrderReturnsDto): Promise<IOrderReturnListResponse> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderReturnWhereInput = {};
    if (params.status !== undefined) {
      where.status = params.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.orderReturn.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: ORDER_RETURN_INCLUDE,
        skip,
        take: limit,
      }),
      this.prisma.orderReturn.count({ where }),
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

  async updateStatus(
    returnId: string,
    orderId: string,
    data: UpdateOrderReturnStatusDto,
  ): Promise<IOrderReturnResponse> {
    const newOrderStatus = ORDER_STATUS_MAP[data.status];

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.orderReturn.update({
        where: { id: returnId },
        data: { status: data.status },
        include: ORDER_RETURN_INCLUDE,
      });

      if (newOrderStatus) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: newOrderStatus },
        });
      }

      return updated;
    });
  }

  async cancel(returnId: string, orderId: string): Promise<IOrderReturnResponse> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.orderReturn.update({
        where: { id: returnId },
        data: { status: EOrderReturnStatus.CANCELLED },
        include: ORDER_RETURN_INCLUDE,
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: EOrderStatus.DELIVERED },
      });

      return updated;
    });
  }
}
