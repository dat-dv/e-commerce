import { Controller, Post, Body, UseGuards, Get, Put, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { Language } from 'src/common/decorators/language.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateProductCategoryUseCase } from './domain/use-cases/create-category.use-case';
import { UpdateProductCategoryUseCase } from './domain/use-cases/update-product-category.use-case';
import { GetAllProductCategoriesUseCase } from './domain/use-cases/get-all-product-categories.use-case';
import { DeleteProductCategoryUseCase } from './domain/use-cases/delete-product-category.use-case';
import { GetProductCategoryGroupsUseCase } from './domain/use-cases/get-product-category-groups.use-case';
import { GetProductCategoryByIdUseCase } from './domain/use-cases/get-product-category-by-id.use-case';
import { GetProductCategoryTreeUseCase } from './domain/use-cases/get-product-category-tree.use-case';
import { GetProductCategoryTreeBySlugUseCase } from './domain/use-cases/get-product-category-tree-by-slug.use-case';
import createSuccessResponse from 'src/common/respomse';
import { CreateCategoryDto } from './dto/create-product-category.dto';
import { UpdateCategoryDto } from './dto/update-product-category.dto';
import { IApiResponse, ICategoryResponse, ICategoryListResponse, ICategoryTreeResponse } from '@ecommerce/shared';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateProductCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateProductCategoryUseCase,
    private readonly getAllCategoriesUseCase: GetAllProductCategoriesUseCase,
    private readonly deleteCategoryUseCase: DeleteProductCategoryUseCase,
    private readonly getGroupsUseCase: GetProductCategoryGroupsUseCase,
    private readonly getByIdUseCase: GetProductCategoryByIdUseCase,
    private readonly getTreeUseCase: GetProductCategoryTreeUseCase,
    private readonly getTreeBySlugUseCase: GetProductCategoryTreeBySlugUseCase,
  ) {}

  @UseGuards(PermissionsGuard)
  @Permissions('CREATE:CATEGORY')
  @Post()
  async createCategory(@Body() body: CreateCategoryDto): Promise<IApiResponse<ICategoryResponse>> {
    const result = await this.createCategoryUseCase.execute(body);
    return createSuccessResponse(result);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('UPDATE:CATEGORY')
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<IApiResponse<ICategoryResponse>> {
    const result = await this.updateCategoryUseCase.execute(id, body);
    return createSuccessResponse(result);
  }

  @Get()
  async getAllCategories(
    @Query() query: { page?: string; limit?: string; level?: string },
  ): Promise<IApiResponse<ICategoryListResponse>> {
    const result = await this.getAllCategoriesUseCase.execute({
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      level: query.level ? parseInt(query.level) : undefined,
    });
    return createSuccessResponse(result);
  }

  @Get('groups')
  async getGroups(@Language() lang: string): Promise<IApiResponse<ICategoryListResponse>> {
    const result = await this.getGroupsUseCase.execute(lang);
    return createSuccessResponse(result);
  }

  @Get('tree')
  async getTree(@Language() lang: string): Promise<IApiResponse<ICategoryTreeResponse>> {
    const result = await this.getTreeUseCase.execute(lang);
    return createSuccessResponse(result);
  }

  @Get('tree/:slug')
  async getTreeBySlug(@Param('slug') slug: string, @Language() lang: string): Promise<IApiResponse<ICategoryResponse>> {
    const result = await this.getTreeBySlugUseCase.execute(lang, slug);
    if (!result) throw new NotFoundException('Category not found');
    return createSuccessResponse(result);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Language() lang: string): Promise<IApiResponse<ICategoryResponse>> {
    const result = await this.getByIdUseCase.execute(id, lang);
    if (!result) throw new NotFoundException('Category not found');
    return createSuccessResponse(result);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('DELETE:CATEGORY')
  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<IApiResponse<ICategoryResponse>> {
    const result = await this.deleteCategoryUseCase.execute(id);
    return createSuccessResponse(result);
  }
}
