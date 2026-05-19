import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { IApiResponse, IOrderReturnListResponse, IOrderReturnResponse } from '@ecommerce/shared';
import type { Request } from 'express';
import createSuccessResponse from 'src/common/respomse';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateOrderReturnDto } from './dto/create-order-return.dto';
import { GetOrderReturnsDto } from './dto/get-order-returns.dto';
import { UpdateOrderReturnStatusDto } from './dto/update-order-return-status.dto';
import { CancelOrderReturnUseCase } from './domain/use-cases/cancel-order-return.use-case';
import { CreateOrderReturnUseCase } from './domain/use-cases/create-order-return.use-case';
import { GetOrderReturnsUseCase } from './domain/use-cases/get-order-returns.use-case';
import { UpdateOrderReturnStatusUseCase } from './domain/use-cases/update-order-return-status.use-case';

@Controller('order-returns')
@UseGuards(AuthGuard)
export class OrderReturnsController {
  constructor(
    private readonly cancelOrderReturnUseCase: CancelOrderReturnUseCase,
    private readonly createOrderReturnUseCase: CreateOrderReturnUseCase,
    private readonly getOrderReturnsUseCase: GetOrderReturnsUseCase,
    private readonly updateOrderReturnStatusUseCase: UpdateOrderReturnStatusUseCase,
  ) {}

  @Get('all')
  @UseGuards(PermissionsGuard)
  @Permissions('LIST:ANY_ORDER_RETURN')
  async getOrderReturns(@Query() query: GetOrderReturnsDto): Promise<IApiResponse<IOrderReturnListResponse>> {
    const result = await this.getOrderReturnsUseCase.execute(query);
    return createSuccessResponse(result);
  }

  @Post(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('CREATE:ORDER_RETURN')
  async createReturn(
    @Param('id') id: string,
    @Body() body: CreateOrderReturnDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IOrderReturnResponse>> {
    const userId = req.user?.sub;
    const result = await this.createOrderReturnUseCase.execute(id, userId, body);
    return createSuccessResponse(result);
  }

  @Put(':id/cancel')
  @UseGuards(PermissionsGuard)
  @Permissions('CANCEL:OWN_ORDER_RETURN')
  async cancelReturn(@Param('id') id: string, @Req() req: Request): Promise<IApiResponse<IOrderReturnResponse>> {
    const userId = req.user?.sub;
    const result = await this.cancelOrderReturnUseCase.execute(id, userId);
    return createSuccessResponse(result);
  }

  @Put(':id/status')
  @UseGuards(PermissionsGuard)
  @Permissions('UPDATE:ORDER_RETURN')
  async updateReturnStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderReturnStatusDto,
  ): Promise<IApiResponse<IOrderReturnResponse>> {
    const result = await this.updateOrderReturnStatusUseCase.execute(id, body);
    return createSuccessResponse(result);
  }
}
