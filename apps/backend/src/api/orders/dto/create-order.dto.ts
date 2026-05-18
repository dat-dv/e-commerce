import { IsArray, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ICreateOrderRequest } from '@ecommerce/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto implements ICreateOrderRequest {
  @ApiProperty({
    description: 'Array of shopping cart item IDs to check out',
    type: [String],
    example: ['cart-item-id-1', 'cart-item-id-2'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  cartItemIds: string[];

  @ApiPropertyOptional({
    description: 'The shipping address ID where the order will be delivered',
    example: 'address-id-123',
  })
  @IsString()
  @IsOptional()
  shippingAddressId?: string;

  @ApiPropertyOptional({
    description: 'Optional discount coupon or promo code to apply to the checkout total',
    example: 'SUMMER2026',
  })
  @IsString()
  @IsOptional()
  promoCode?: string;
}
