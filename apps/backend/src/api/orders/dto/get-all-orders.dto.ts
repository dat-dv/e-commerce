import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

import { EOrderSortBy, EOrderStatus, ESortValue, IGetAllOrdersRequest } from '@ecommerce/shared';

export class GetAllOrdersDto implements IGetAllOrdersRequest {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    enum: EOrderStatus,
    enumName: 'EOrderStatus',
    isArray: true,
    example: [EOrderStatus.PENDING],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value.map((item) => Number(item));
    }

    return String(value)
      .split(',')
      .map((item) => Number(item.trim()));
  })
  @IsArray()
  @IsEnum(EOrderStatus, { each: true })
  status?: EOrderStatus[];

  @ApiPropertyOptional({
    example: 'iphone',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;

  @ApiPropertyOptional({
    enum: EOrderSortBy,
    enumName: 'EOrderSortBy',
    default: EOrderSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(EOrderSortBy)
  sort_by: EOrderSortBy = EOrderSortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: ESortValue,
    enumName: 'ESortValue',
    default: ESortValue.DESC,
  })
  @IsOptional()
  @IsEnum(ESortValue)
  sort_order: ESortValue = ESortValue.DESC;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  user_id?: string;
}
