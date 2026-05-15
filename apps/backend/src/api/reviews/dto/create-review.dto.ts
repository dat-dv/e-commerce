import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsArray } from 'class-validator';
import { ICreateReviewRequest } from '@ecommerce/shared';

export class CreateReviewDto implements ICreateReviewRequest {
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
