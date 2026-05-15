import { Controller, Post, Body, UseGuards, Get, Put, Param, Delete, Query, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateReviewUseCase } from './domain/use-cases/create-review.use-case';
import { UpdateReviewUseCase } from './domain/use-cases/update-review.use-case';
import { GetReviewsUseCase } from './domain/use-cases/get-reviews.use-case';
import { DeleteReviewUseCase } from './domain/use-cases/delete-review.use-case';
import { IApiResponse, IReviewResponse, IReviewListResponse } from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsArray } from 'class-validator';
import type { Request } from 'express';

class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  sku_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly getReviewsUseCase: GetReviewsUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createReview(@Body() body: CreateReviewDto, @Req() req: Request): Promise<IApiResponse<IReviewResponse>> {
    const userId = req.user.sub;
    const result = await this.createReviewUseCase.execute({ ...body, user_id: userId });
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() body: UpdateReviewDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IReviewResponse>> {
    const userId = req.user.sub;
    const result = await this.updateReviewUseCase.execute(id, userId, body);
    return createSuccessResponse(result);
  }

  @Get()
  async getReviews(@Query('product_id') productId?: string): Promise<IApiResponse<IReviewListResponse>> {
    const result = await this.getReviewsUseCase.execute(productId);
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id') id: string, @Req() req: Request): Promise<IApiResponse<IReviewResponse>> {
    const userId = req.user.sub;
    const result = await this.deleteReviewUseCase.execute(id, userId);
    return createSuccessResponse(result);
  }
}
