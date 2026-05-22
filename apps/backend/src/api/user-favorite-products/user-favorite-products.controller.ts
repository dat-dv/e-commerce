import {
  IApiResponse,
  IPaginatedResult,
  IToggleUserFavoriteProductResponse,
  IUserFavoriteProductResponse,
} from '@ecommerce/shared';
import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Language } from 'src/common/decorators/language.decorator';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUserFavoriteProductsDto } from './dto/get-user-favorite-products.dto';
import { UserFavoriteProductsService } from './user-favorite-products.service';

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
    @Query() query: GetUserFavoriteProductsDto,
    @Language() lang: string,
  ): Promise<IApiResponse<IPaginatedResult<IUserFavoriteProductResponse>>> {
    const userId = req.user?.sub;
    const result = await this.userFavoriteProductsService.getUserFavoriteProducts(userId, query, lang);
    return createSuccessResponse(result);
  }
}
