import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateCategoryUseCase } from './domain/use-cases/create-category.use-case';
import createSuccessResponse from 'src/common/respomse';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @UseGuards(AuthGuard)
  @Post()
  async createCategory(@Body() body: CreateCategoryDto) {
    const result = await this.createCategoryUseCase.execute(body);
    return createSuccessResponse(result);
  }
}
