import {
  ICreateFlashSaleProductRequest,
  ICreateFlashSaleRequest,
  ICreateFlashSalesBatchRequest,
} from '@ecommerce/shared';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

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

export class CreateFlashSalesBatchDto implements ICreateFlashSalesBatchRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleDto)
  flash_sales: CreateFlashSaleDto[];
}
