import { IsOptional, IsNumber, Min, Max, IsArray, IsString } from 'class-validator';
import { IUpdateReviewRequest } from '@ecommerce/shared';

export class UpdateReviewDto implements IUpdateReviewRequest {
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
