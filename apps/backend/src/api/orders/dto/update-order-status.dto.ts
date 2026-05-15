import { IsNotEmpty, IsEnum } from 'class-validator';
import { EOrderStatus } from '../domain/entities/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(EOrderStatus)
  status: number;
}
