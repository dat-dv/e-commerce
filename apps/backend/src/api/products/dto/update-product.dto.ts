import { IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IUpdateProductRequest, IUpdateProductSkuRequest, IUpdateProductTranslationRequest } from '@ecommerce/shared';

export class UpdateProductTranslationDto implements IUpdateProductTranslationRequest {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  language_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProductSkuDto implements IUpdateProductSkuRequest {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  sku_code: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;
}

export class UpdateProductDto implements IUpdateProductRequest {
  @IsNumber()
  @IsOptional()
  base_price?: number;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  brand_id?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category_ids?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductTranslationDto)
  @IsOptional()
  translations?: UpdateProductTranslationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductSkuDto)
  @IsOptional()
  skus?: UpdateProductSkuDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deleted_sku_ids?: string[];
}
