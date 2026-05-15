import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe, Param, NotFoundException } from '@nestjs/common';
import { Language } from 'src/common/decorators/language.decorator';
import { GetTopBrandsUseCase } from './domain/use-cases/get-top-brands.use-case';
import { GetBrandBySlugUseCase } from './domain/use-cases/get-brand-by-slug.use-case';
import { GetBrandProductsUseCase } from './domain/use-cases/get-brand-products.use-case';
import createSuccessResponse from 'src/common/respomse';
import { IApiResponse, IBrandResponse, IBrandListResponse, IBrandProductsResponse } from '@ecommerce/shared';

@Controller('brands')
export class BrandsController {
  constructor(
    private readonly getTopBrandsUseCase: GetTopBrandsUseCase,
    private readonly getBrandBySlugUseCase: GetBrandBySlugUseCase,
    private readonly getBrandProductsUseCase: GetBrandProductsUseCase,
  ) {}

  @Get('top')
  async getTopBrands(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Language() lang: string,
  ): Promise<IApiResponse<IBrandListResponse>> {
    const parsedLimit = Math.min(50, limit);
    const result = await this.getTopBrandsUseCase.execute(page, parsedLimit, lang);
    return createSuccessResponse(result);
  }

  @Get(':slug')
  async getBrandBySlug(@Param('slug') slug: string, @Language() lang: string): Promise<IApiResponse<IBrandResponse>> {
    const result = await this.getBrandBySlugUseCase.execute(slug, lang);
    if (!result) {
      throw new NotFoundException(`Brand with slug ${slug} not found`);
    }
    return createSuccessResponse(result);
  }

  @Get(':slug/products')
  async getBrandProducts(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Language() lang: string,
  ): Promise<IApiResponse<IBrandProductsResponse>> {
    const parsedLimit = Math.min(50, limit);
    const result = await this.getBrandProductsUseCase.execute(slug, page, parsedLimit, lang);
    return createSuccessResponse(result);
  }
}
