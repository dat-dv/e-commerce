import type { RequestWithUser } from 'src/shared/types/request.type';
import { Controller, Get, Param, Query, Req, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Language } from 'src/common/decorators/language.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetRecommendedUseCase } from './domain/use-cases/get-recommended.use-case';
import { GetInterestBasedUseCase } from './domain/use-cases/get-interest-based.use-case';
import { GetRecentlyViewedUseCase } from './domain/use-cases/get-recently-viewed.use-case';
import { GetFlashSaleUseCase } from './domain/use-cases/get-flash-sale.use-case';
import { GetProductsUseCase } from './domain/use-cases/get-products.use-case';
import { GetProductDetailUseCase } from './domain/use-cases/get-product-detail.use-case';
import { GetProductReviewsUseCase } from './domain/use-cases/get-product-reviews.use-case';
import { GetSimilarProductsUseCase } from './domain/use-cases/get-similar-products.use-case';
import { GetProductsDto } from './dto/get-products.dto';
import { GetProductReviewsDto } from './dto/get-product-reviews.dto';
import {
  IApiResponse,
  IProductResponse,
  IProductListResponse,
  IProductDetailResponse,
  IPaginatedResult,
  Review,
} from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';

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
  async getProducts(
    @Req() req: RequestWithUser,
    @Query() query: GetProductsDto,
  ): Promise<IApiResponse<IProductListResponse>> {
    const user_id = req.user?.sub;
    const result = await this.getProductsUseCase.execute({
      ...query,
      user_id,
    });
    return createSuccessResponse(result);
  }

  @Get('recommended')
  async getRecommended(
    @Req() req: RequestWithUser,
    @Language() lang: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
  ): Promise<IApiResponse<IPaginatedResult<IProductResponse>>> {
    const userId = req.user?.sub;
    const result = await this.getRecommendedUseCase.execute(page, limit, userId, lang);
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Get('based-on-interest')
  async getBasedOnInterest(
    @Req() req: RequestWithUser,
    @Language() lang: string,
  ): Promise<IApiResponse<IProductResponse[]>> {
    const userId = req.user?.sub;
    const result = await this.getInterestBasedUseCase.execute(12, userId, lang);
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Get('recently-viewed')
  async getRecentlyViewed(
    @Req() req: RequestWithUser,
    @Language() lang: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
  ): Promise<IApiResponse<IPaginatedResult<IProductResponse>>> {
    const userId = req.user?.sub;
    const result = await this.getRecentlyViewedUseCase.execute(userId, page, limit, lang);
    return createSuccessResponse(result);
  }

  @Get('flash-sale')
  async getFlashSale(
    @Req() req: RequestWithUser,
    @Language() lang: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<IApiResponse<IPaginatedResult<IProductResponse>>> {
    const userId = req.user?.sub;
    const result = await this.getFlashSaleUseCase.execute(lang, userId, page, limit);
    return createSuccessResponse(result);
  }

  @Get(':slug')
  async getProductDetail(
    @Param('slug') slug: string,
    @Req() req: RequestWithUser,
    @Language() lang: string,
  ): Promise<IApiResponse<IProductDetailResponse>> {
    const userId = req.user?.sub;
    const result = await this.getProductDetailUseCase.execute(slug, lang, userId);
    return createSuccessResponse(result);
  }

  @Get(':id/reviews')
  async getProductReviews(
    @Param('id') id: string,
    @Query() query: GetProductReviewsDto,
  ): Promise<IApiResponse<IPaginatedResult<Review>>> {
    const result = await this.getProductReviewsUseCase.execute(id, query);
    return createSuccessResponse(result);
  }

  @Get(':id/similar')
  async getSimilarProducts(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
    @Language() lang: string,
  ): Promise<IApiResponse<IProductResponse[]>> {
    const result = await this.getSimilarProductsUseCase.execute(id, limit, lang);
    return createSuccessResponse(result);
  }
}
