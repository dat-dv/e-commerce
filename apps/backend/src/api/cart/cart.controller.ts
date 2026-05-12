import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetCartUseCase } from './domain/use-cases/get-cart.use-case';
import { AddToCartUseCase } from './domain/use-cases/add-to-cart.use-case';
import { UpdateCartItemUseCase } from './domain/use-cases/update-cart-item.use-case';
import { RemoveFromCartUseCase } from './domain/use-cases/remove-from-cart.use-case';
import createSuccessResponse from 'src/common/respomse';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';

class AddToCartDto {
  @ApiProperty({ example: 'sku_123', description: 'SKU ID' })
  @IsNotEmpty()
  @IsString()
  sku_id: string;

  @ApiProperty({ example: 1, description: 'Quantity' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

class UpdateCartItemDto {
  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

@ApiTags('Cart')
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
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Return cart data' })
  async getCart(@Req() req: Request, @Query('lang') lang: string = 'vi') {
    const userId = req.user.sub;
    const result = await this.getCartUseCase.execute(userId, lang);
    return createSuccessResponse(result);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  async addItem(@Body() body: AddToCartDto, @Req() req: Request) {
    const userId = req.user.sub;
    const result = await this.addToCartUseCase.execute(userId, body.sku_id, body.quantity);
    return createSuccessResponse(result);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  async updateItem(@Param('id') id: string, @Body() body: UpdateCartItemDto) {
    const result = await this.updateCartItemUseCase.execute(id, body.quantity);
    return createSuccessResponse(result);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  async removeItem(@Param('id') id: string) {
    const result = await this.removeFromCartUseCase.execute(id);
    return createSuccessResponse(result);
  }
}
