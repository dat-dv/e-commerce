import { Controller, Post, Get, Param, UseGuards, Req, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UserFavoriteProductsService } from './user-favorite-products.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Language } from 'src/common/decorators/language.decorator';
import type { Request } from 'express';
import {
  IApiResponse,
  IUserFavoriteProductResponse,
  IToggleUserFavoriteProductResponse,
  IPaginatedResult,
} from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';

@Controller('user-favorite-products')
@UseGuards(AuthGuard)
export class UserFavoriteProductsController {
  constructor(private readonly userFavoriteProductsService: UserFavoriteProductsService) {}

  @Post('toggle/:productId')
  async toggle(
    @Req() req: Request,
    @Param('productId') productId: string,
  ): Promise<IApiResponse<IToggleUserFavoriteProductResponse>> {
    const userId = req.user?.sub;
    const result = await this.userFavoriteProductsService.toggle(userId, productId);
    return createSuccessResponse(result);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserFavoriteProducts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Language() lang: string,
  ): Promise<IApiResponse<IPaginatedResult<IUserFavoriteProductResponse>>> {
    const userId = req.user?.sub;
    const result = await this.userFavoriteProductsService.getUserFavoriteProducts(userId, page, limit, lang);
    return createSuccessResponse(result);
  }
}
