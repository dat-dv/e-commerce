import { IsOptional, IsString, IsInt, Min, Max, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EProductSort } from '@ecommerce/shared';

export class GetProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  category_slug?: string;

  @IsOptional()
  @IsString()
  brand_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  max_price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attribute_value_ids?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsEnum(EProductSort)
  sort?: EProductSort;

  @IsOptional()
  @IsString()
  languageCode?: string = 'vi';
}
