import { Injectable } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Order, Prisma } from '../../../../../generated/prisma/client';
import { EOrderStatus, IPaginatedResult } from '@ecommerce/shared';

interface ICreateOrderInput {
  user_id: string;
  total_amount: number;
  discount_amount?: number;
  shipping_address_id?: string;
  coupon_id?: string;
  items: { sku_id: string; quantity: number; price: number; flash_sale_id?: string; snapshot?: unknown }[];
}

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async createOrder(data: ICreateOrderInput): Promise<Order> {
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
      include: {
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
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
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
      },
    });
  }

  async getUserOrders(
    userId: string,
    params?: { status?: number[]; page?: number; limit?: number },
  ): Promise<IPaginatedResult<Order>> {
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
        include: {
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
        },
      },
      page,
      limit,
    );

    return result;
  }

  async updateStatus(id: string, status: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async cancelOrder(id: string, userId: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id, user_id: userId },
      data: { status: EOrderStatus.CANCELLED },
      include: { items: true },
    });
  }
}
