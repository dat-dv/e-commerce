import { IsOptional, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { IGetOrderReturnsRequest, EOrderReturnStatus } from '@ecommerce/shared';

export class GetOrderReturnsDto implements IGetOrderReturnsRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(EOrderReturnStatus)
  status?: EOrderReturnStatus;
}
