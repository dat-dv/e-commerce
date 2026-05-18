import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EOrderStatus } from '@ecommerce/shared';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'The new order status value',
    enum: EOrderStatus,
    example: EOrderStatus.CONFIRMED,
  })
  @IsNotEmpty()
  @IsEnum(EOrderStatus)
  status: number;
}
