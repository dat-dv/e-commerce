import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { EOrderStatus, EOrderReturnStatus } from '@ecommerce/shared';
import { CreateOrderReturnDto } from '../../dto/create-order-return.dto';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { ENotificationType } from '@ecommerce/shared';

@Injectable()
export class CreateOrderReturnUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(orderId: string, userId: string, dto: CreateOrderReturnDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to request a return on this order');
    }

    if (order.status !== Number(EOrderStatus.DELIVERED)) {
      throw new BadRequestException('Return requests are only allowed for delivered orders');
    }

    const existing = await this.prisma.orderReturn.findUnique({
      where: { order_id: orderId },
    });

    if (existing) {
      throw new BadRequestException('A return request already exists for this order');
    }

    const orderReturn = await this.prisma.orderReturn.create({
      data: {
        order_id: orderId,
        title: dto.title,
        description: dto.description,
        status: EOrderReturnStatus.PENDING,
        created_by_id: userId,
        images:
          dto.imageIds && dto.imageIds.length > 0
            ? {
                create: dto.imageIds.map((id) => ({
                  image: { connect: { id } },
                })),
              }
            : undefined,
      },
      include: {
        images: { include: { image: true } },
      },
    });

    // Update order status to RETURN_REQUESTED
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: EOrderStatus.RETURN_REQUESTED },
    });

    await this.notificationService.sendToUser(
      userId,
      'Return request submitted',
      `Your return request for order #${orderId.slice(-6).toUpperCase()} is under review.`,
      ENotificationType.ORDER,
      { orderId, returnId: orderReturn.id },
    );

    return orderReturn;
  }
}
