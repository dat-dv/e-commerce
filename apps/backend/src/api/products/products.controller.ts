import { Controller, Get, Param, Query, Req, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Language } from 'src/common/decorators/language.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { GetRecommendedUseCase } from './domain/use-cases/get-recommended.use-case';
import { GetInterestBasedUseCase } from './domain/use-cases/get-interest-based.use-case';
import { GetRecentlyViewedUseCase } from './domain/use-cases/get-recently-viewed.use-case';
import { GetFlashSaleUseCase } from './domain/use-cases/get-flash-sale.use-case';
import { GetProductsUseCase } from './domain/use-cases/get-products.use-case';
import { GetProductDetailUseCase } from './domain/use-cases/get-product-detail.use-case';
import { GetProductReviewsUseCase } from './domain/use-cases/get-product-reviews.use-case';
import { GetSimilarProductsUseCase } from './domain/use-cases/get-similar-products.use-case';
import { GetProductsDto } from './dto/get-products.dto';
import createSuccessResponse from 'src/common/respomse';
import type { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getRecommendedUseCase: GetRecommendedUseCase,
    private readonly getInterestBasedUseCase: GetInterestBasedUseCase,
    private readonly getRecentlyViewedUseCase: GetRecentlyViewedUseCase,
    private readonly getFlashSaleUseCase: GetFlashSaleUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductDetailUseCase: GetProductDetailUseCase,
    private readonly getProductReviewsUseCase: GetProductReviewsUseCase,
    private readonly getSimilarProductsUseCase: GetSimilarProductsUseCase,
  ) {}

  @Get()
  async getProducts(@Query() query: GetProductsDto) {
    const result = await this.getProductsUseCase.execute(query);
    return createSuccessResponse(result);
  }

  @Get('recommended')
  async getRecommended(@Language() lang: string) {
    const result = await this.getRecommendedUseCase.execute(12); // Tạm thời chưa truyền lang
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Get('based-on-interest')
  async getBasedOnInterest(@Req() req: Request, @Language() lang: string) {
    const userId = req.user?.sub;
    const result = await this.getInterestBasedUseCase.execute(12, userId); // Tạm thời chưa truyền lang
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Get('recently-viewed')
  async getRecentlyViewed(@Req() req: Request, @Language() lang: string) {
    const userId = req.user?.sub;
    const result = await this.getRecentlyViewedUseCase.execute(userId, 10, lang);
    return createSuccessResponse(result);
  }

  @Get('flash-sale')
  async getFlashSale(@Language() lang: string) {
    const result = await this.getFlashSaleUseCase.execute(lang);
    return createSuccessResponse(result);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':slug')
  async getProductDetail(@Param('slug') slug: string, @Req() req: Request, @Language() lang: string) {
    const userId = req.user?.sub;
    const result = await this.getProductDetailUseCase.execute(slug, lang, userId);
    return createSuccessResponse(result);
  }

  @Get(':id/reviews')
  async getProductReviews(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.getProductReviewsUseCase.execute(id, page, limit);
    return createSuccessResponse(result);
  }

  @Get(':id/similar')
  async getSimilarProducts(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
    @Language() lang: string,
  ) {
    const result = await this.getSimilarProductsUseCase.execute(id, limit, lang);
    return createSuccessResponse(result);
  }
}
