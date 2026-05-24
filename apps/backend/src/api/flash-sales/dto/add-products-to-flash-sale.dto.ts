import { IAddProductsToFlashSaleRequest } from '@ecommerce/shared';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateFlashSaleProductDto } from './create-flash-sale.dto';

export class AddProductsToFlashSaleDto implements IAddProductsToFlashSaleRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleProductDto)
  products: CreateFlashSaleProductDto[];
}
