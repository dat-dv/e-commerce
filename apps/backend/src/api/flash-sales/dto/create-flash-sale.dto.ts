import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICreateFlashSaleRequest, ICreateFlashSaleProductRequest } from '@ecommerce/shared';

/**
 * DTO for creating a product entry inside a Flash Sale.
 */
export class CreateFlashSaleProductDto implements ICreateFlashSaleProductRequest {
  @IsString()
  @IsNotEmpty()
  sku_id: string;

  @IsNumber()
  @IsPositive()
  sale_price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  order_limit?: number;
}

/**
 * DTO for creating a Flash Sale campaign.
 */
export class CreateFlashSaleDto implements ICreateFlashSaleRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsString()
  time_slot_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleProductDto)
  products: CreateFlashSaleProductDto[];
}
