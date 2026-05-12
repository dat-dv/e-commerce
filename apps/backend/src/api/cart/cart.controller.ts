import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetCartUseCase } from './domain/use-cases/get-cart.use-case';
import { AddToCartUseCase } from './domain/use-cases/add-to-cart.use-case';
import { UpdateCartItemUseCase } from './domain/use-cases/update-cart-item.use-case';
import { RemoveFromCartUseCase } from './domain/use-cases/remove-from-cart.use-case';
import createSuccessResponse from 'src/common/respomse';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import type { Request } from 'express';

class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  sku_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

class UpdateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeFromCartUseCase: RemoveFromCartUseCase,
  ) {}

  @Get()
  async getCart(@Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.getCartUseCase.execute(userId);
    return createSuccessResponse(result);
  }

  @Post('items')
  async addItem(@Body() body: AddToCartDto, @Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.addToCartUseCase.execute(userId, body.sku_id, body.quantity);
    return createSuccessResponse(result);
  }

  @Put('items/:id')
  async updateItem(@Param('id') id: string, @Body() body: UpdateCartItemDto) {
    const result = await this.updateCartItemUseCase.execute(id, body.quantity);
    return createSuccessResponse(result);
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string) {
    const result = await this.removeFromCartUseCase.execute(id);
    return createSuccessResponse(result);
  }
}
