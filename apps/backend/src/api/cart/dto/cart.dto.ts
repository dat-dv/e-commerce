import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAddToCartRequest, IUpdateCartItemRequest } from '@ecommerce/shared';

export class AddToCartDto implements IAddToCartRequest {
  @ApiProperty({ example: 'sku_123', description: 'SKU ID' })
  @IsNotEmpty()
  @IsString()
  sku_id: string;

  @ApiProperty({ example: 1, description: 'Quantity (can be negative for decrease)' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class UpdateCartItemDto implements IUpdateCartItemRequest {
  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}
