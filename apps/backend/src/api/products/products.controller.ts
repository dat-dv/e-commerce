import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetRecommendationsUseCase } from './domain/use-cases/get-recommendations.use-case';
import { GetFlashSaleUseCase } from './domain/use-cases/get-flash-sale.use-case';
import createSuccessResponse from 'src/common/respomse';
import express from 'express';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
    private readonly getFlashSaleUseCase: GetFlashSaleUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Get('recommendations')
  async getRecommendations(@Req() req: express.Request) {
    const userId = req.user?.sub; // Lấy từ JWT payload trong AuthGuard
    const result = await this.getRecommendationsUseCase.execute(userId);
    return createSuccessResponse(result);
  }

  @Get('flash-sale')
  async getFlashSale() {
    const result = await this.getFlashSaleUseCase.execute();
    return createSuccessResponse(result);
  }
}
