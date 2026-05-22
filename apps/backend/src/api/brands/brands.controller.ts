import {
  IApiResponse,
  IBrandListResponse,
  IBrandProductsResponse,
  IBrandResponse,
  ICategoryResponse,
} from '@ecommerce/shared';
import { Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Language } from 'src/common/decorators/language.decorator';
import createSuccessResponse from 'src/common/respomse';
import { GetBrandBySlugUseCase } from './domain/use-cases/get-brand-by-slug.use-case';
import { GetBrandCategoryTreeUseCase } from './domain/use-cases/get-brand-category-tree.use-case';
import { GetBrandProductsUseCase } from './domain/use-cases/get-brand-products.use-case';
import { GetBrandListUseCase } from './domain/use-cases/get-top-brands.use-case';
import { GetBrandListDto } from './dto/get-brand-list.dto';

@Controller('brands')
export class BrandsController {
  constructor(
    private readonly getTopBrandsUseCase: GetBrandListUseCase,
    private readonly getBrandBySlugUseCase: GetBrandBySlugUseCase,
    private readonly getBrandProductsUseCase: GetBrandProductsUseCase,
    private readonly getBrandCategoryTreeUseCase: GetBrandCategoryTreeUseCase,
  ) {}

  @Get('top')
  async getTopBrands(
    @Query() query: GetBrandListDto,
    @Language() lang: string,
  ): Promise<IApiResponse<IBrandListResponse>> {
    const result = await this.getTopBrandsUseCase.execute(query, lang);
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

  @Get(':slug/categories')
  async getBrandCategories(
    @Param('slug') slug: string,
    @Language() lang: string,
  ): Promise<IApiResponse<ICategoryResponse[]>> {
    const result = await this.getBrandCategoryTreeUseCase.execute(slug, lang);
    return createSuccessResponse(result);
  }

  @Get(':slug/products')
  async getBrandProducts(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('q') search: string | undefined,
    @Query('category') category: string | undefined,
    @Language() lang: string,
  ): Promise<IApiResponse<IBrandProductsResponse>> {
    const parsedLimit = Math.min(50, limit);
    const result = await this.getBrandProductsUseCase.execute(slug, page, parsedLimit, lang, search, category);
    return createSuccessResponse(result);
  }
}
