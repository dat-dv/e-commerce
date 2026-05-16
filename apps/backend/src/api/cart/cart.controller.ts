import type { RequestWithUser } from 'src/shared/types/request.type';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetCartUseCase } from './domain/use-cases/get-cart.use-case';
import { AddToCartUseCase } from './domain/use-cases/add-to-cart.use-case';
import { UpdateCartItemUseCase } from './domain/use-cases/update-cart-item.use-case';
import { RemoveFromCartUseCase } from './domain/use-cases/remove-from-cart.use-case';
import createSuccessResponse from 'src/common/respomse';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Language } from 'src/common/decorators/language.decorator';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { IApiResponse, ICartResponse, ICartItemResponse } from '@ecommerce/shared';

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
  async getCart(@Req() req: RequestWithUser, @Language() lang: string): Promise<IApiResponse<ICartResponse | null>> {
    const userId = req.user.sub;
    const result = await this.getCartUseCase.execute(userId, lang);
    return createSuccessResponse(result);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  async addItem(
    @Body() body: AddToCartDto,
    @Req() req: RequestWithUser,
    @Language() lang: string,
  ): Promise<IApiResponse<ICartItemResponse>> {
    const userId = req.user.sub;
    const result = await this.addToCartUseCase.execute(userId, body, lang);
    return createSuccessResponse(result);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  async updateItem(@Param('id') id: string, @Body() body: UpdateCartItemDto): Promise<IApiResponse<ICartItemResponse>> {
    const result = await this.updateCartItemUseCase.execute(id, body);
    return createSuccessResponse(result);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  async removeItem(@Param('id') id: string): Promise<IApiResponse<ICartItemResponse | null>> {
    const result = await this.removeFromCartUseCase.execute(id);
    return createSuccessResponse(result);
  }
}
