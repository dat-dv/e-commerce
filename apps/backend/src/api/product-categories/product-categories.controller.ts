import { Controller, Post, Body, UseGuards, Get, Put, Param, Delete } from '@nestjs/common';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateProductCategoryUseCase } from './domain/use-cases/create-category.use-case';
import { UpdateProductCategoryUseCase } from './domain/use-cases/update-product-category.use-case';
import { GetAllProductCategoriesUseCase } from './domain/use-cases/get-all-product-categories.use-case';
import { DeleteProductCategoryUseCase } from './domain/use-cases/delete-product-category.use-case';
import createSuccessResponse from 'src/common/respomse';
import { CreateCategoryDto } from './dto/create-product-category.dto';
import { UpdateCategoryDto } from './dto/update-product-category.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateProductCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateProductCategoryUseCase,
    private readonly getAllCategoriesUseCase: GetAllProductCategoriesUseCase,
    private readonly deleteCategoryUseCase: DeleteProductCategoryUseCase,
  ) {}

  @UseGuards(PermissionsGuard)
  @Permissions('CREATE:CATEGORY')
  @Post()
  async createCategory(@Body() body: CreateCategoryDto) {
    const result = await this.createCategoryUseCase.execute(body);
    return createSuccessResponse(result);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('UPDATE:CATEGORY')
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    const result = await this.updateCategoryUseCase.execute(id, body);
    return createSuccessResponse(result);
  }

  @Get()
  async getAllCategories() {
    const result = await this.getAllCategoriesUseCase.execute();
    return createSuccessResponse(result);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('DELETE:CATEGORY')
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const result = await this.deleteCategoryUseCase.execute(id);
    return createSuccessResponse(result);
  }
}
