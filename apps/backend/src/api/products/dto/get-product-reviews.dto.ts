import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export const PRODUCT_REVIEW_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  RATING_DESC: 'rating_desc',
  RATING_ASC: 'rating_asc',
} as const;

type ProductReviewSort = (typeof PRODUCT_REVIEW_SORT)[keyof typeof PRODUCT_REVIEW_SORT];

export class GetProductReviewsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean()
  has_images?: boolean;

  @IsOptional()
  @IsEnum(PRODUCT_REVIEW_SORT)
  sort?: ProductReviewSort = PRODUCT_REVIEW_SORT.NEWEST;
}
