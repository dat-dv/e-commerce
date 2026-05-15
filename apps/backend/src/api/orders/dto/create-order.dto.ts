import { IsArray, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ICreateOrderRequest } from '@ecommerce/shared';

export class CreateOrderDto implements ICreateOrderRequest {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  cartItemIds: string[];

  @IsString()
  @IsOptional()
  shippingAddressId?: string;

  @IsString()
  @IsOptional()
  promoCode?: string;
}
