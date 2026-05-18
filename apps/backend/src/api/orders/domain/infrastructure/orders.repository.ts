import { Injectable } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { EOrderStatus, IPaginatedResult, IOrderResponse, EOrderSortBy, ESortValue } from '@ecommerce/shared';
import { CreateOrderInputDto, GetUserOrdersDto, GetAllOrdersInputDto } from '../../dto/create-order-input.dto';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private readonly ORDER_INCLUDE = {
    items: {
      include: {
        sku: {
          include: {
            product: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    },
  };

  async createOrder(data: CreateOrderInputDto): Promise<IOrderResponse> {
    return this.prisma.order.create({
      data: {
        user_id: data.user_id,
        total_amount: data.total_amount,
        discount_amount: data.discount_amount,
        shipping_address_id: data.shipping_address_id,
        coupon_id: data.coupon_id,
        status: EOrderStatus.PENDING,
        items: {
          create: data.items.map((item) => ({
            sku_id: item.sku_id,
            quantity: item.quantity,
            price: item.price,
            flash_sale_id: item.flash_sale_id,
            snapshot: item.snapshot as Prisma.InputJsonValue | undefined,
          })),
        },
      },
      include: this.ORDER_INCLUDE,
    });
  }

  async findById(id: string): Promise<IOrderResponse | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: this.ORDER_INCLUDE,
    });
  }

  async getUserOrders(userId: string, params?: GetUserOrdersDto): Promise<IPaginatedResult<IOrderResponse>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const result = await this.paginationService.paginate(
      this.prisma.order,
      {
        where: {
          user_id: userId,
          ...(params?.status && params.status.length > 0 && { status: { in: params.status } }),
        },
        orderBy: { created_at: 'desc' },
        include: this.ORDER_INCLUDE,
      },
      page,
      limit,
    );

    return result;
  }

  async getAllOrders(params?: GetAllOrdersInputDto): Promise<IPaginatedResult<IOrderResponse>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const sortBy: EOrderSortBy = params?.sort_by || EOrderSortBy.CREATED_AT;
    const sortOrder: Prisma.SortOrder = params?.sort_order ? 'asc' : 'desc';

    const where: Prisma.OrderWhereInput = {};

    if (params?.status && params.status.length > 0) {
      where.status = { in: params.status };
    }

    if (params?.user_id) {
      where.user_id = params.user_id;
    }

    if (params?.search) {
      where.OR = [
        { id: { contains: params.search } },
        {
          user: {
            OR: [
              { email: { contains: params.search } },
              { first_name: { contains: params.search } },
              { last_name: { contains: params.search } },
            ],
          },
        },
      ];
    }

    return this.paginationService.paginate(
      this.prisma.order,
      {
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
          ...this.ORDER_INCLUDE,
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
      page,
      limit,
    );
  }

  async updateStatus(id: string, status: number): Promise<IOrderResponse> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: this.ORDER_INCLUDE,
    });
  }

  async cancelOrder(id: string, userId: string): Promise<IOrderResponse> {
    return this.prisma.order.update({
      where: { id, user_id: userId },
      data: { status: EOrderStatus.CANCELLED },
      include: this.ORDER_INCLUDE,
    });
  }
}
