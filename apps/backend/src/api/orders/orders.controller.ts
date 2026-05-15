import { Controller, Post, Body, UseGuards, Get, Put, Param, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateOrderUseCase } from './domain/use-cases/create-order.use-case';
import { GetOrderUseCase } from './domain/use-cases/get-order.use-case';
import { GetUserOrdersUseCase } from './domain/use-cases/get-user-orders.use-case';
import { UpdateOrderStatusUseCase } from './domain/use-cases/update-order-status.use-case';
import { CancelOrderUseCase } from './domain/use-cases/cancel-order.use-case';
import createSuccessResponse from 'src/common/respomse';
import type { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDto, @Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.createOrderUseCase.execute(userId, body);
    return createSuccessResponse(OrderResponseDto.toDto(result));
  }

  @Get()
  async getUserOrders(@Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.getUserOrdersUseCase.execute(userId);
    return createSuccessResponse(OrderResponseDto.toDtos(result));
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.getOrderUseCase.execute(id, userId, false);
    return createSuccessResponse(OrderResponseDto.toDto(result));
  }

  @Put(':id/status')
  @UseGuards(PermissionsGuard)
  @Permissions('UPDATE:ORDER')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    const result = await this.updateOrderStatusUseCase.execute(id, body.status, true);
    return createSuccessResponse(result);
  }

  @Post(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.cancelOrderUseCase.execute(id, userId);
    return createSuccessResponse(result);
  }
}
