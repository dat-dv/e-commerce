import { IsNotEmpty, IsEnum } from 'class-validator';
import { EOrderStatus } from '../domain/entities/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

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
