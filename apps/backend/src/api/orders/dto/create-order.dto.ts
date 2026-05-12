import { IsArray, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
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
