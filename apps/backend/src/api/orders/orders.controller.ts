import { Controller, Post, Body, UseGuards, Get, Put, Param, Req, Query } from '@nestjs/common';
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
import { IApiResponse, IOrderResponse, IPaginatedResult } from '@ecommerce/shared';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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
  async createOrder(@Body() body: CreateOrderDto, @Req() req: Request): Promise<IApiResponse<IOrderResponse>> {
    const userId = req.user.sub;
    const result = await this.createOrderUseCase.execute(userId, body);
    return createSuccessResponse(result);
  }

  @Get()
  async getUserOrders(
    @Req() req: Request,
    @Query('status') status?: string | string[],
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<IApiResponse<IPaginatedResult<IOrderResponse>>> {
    const userId = req.user.sub;

    // Convert status to number array if provided
    let statusArr: number[] | undefined = undefined;
    if (status) {
      statusArr = (Array.isArray(status) ? status : status.split(',')).map((s) => parseInt(s, 10));
    }

    const result = await this.getUserOrdersUseCase.execute(userId, {
      status: statusArr,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return createSuccessResponse(result);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Req() req: Request): Promise<IApiResponse<IOrderResponse | null>> {
    const userId = req.user.sub;
    const result = await this.getOrderUseCase.execute(id, userId, false);
    return createSuccessResponse(result);
  }

  @Put(':id/status')
  @UseGuards(PermissionsGuard)
  @Permissions('UPDATE:ORDER')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ): Promise<IApiResponse<IOrderResponse>> {
    const result = await this.updateOrderStatusUseCase.execute(id, body.status, true);
    return createSuccessResponse(result);
  }

  @Post(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Req() req: Request): Promise<IApiResponse<IOrderResponse>> {
    const userId = req.user.sub;
    const result = await this.cancelOrderUseCase.execute(id, userId);
    return createSuccessResponse(result);
  }
}
