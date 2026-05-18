import { IsOptional, IsInt, Min, Max, IsArray, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EOrderStatus } from '@ecommerce/shared';

export class GetOrdersDto {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
    description: 'The page number to retrieve',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 100,
    description: 'The number of orders per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: EOrderStatus,
    enumName: 'EOrderStatus',
    isArray: true,
    example: [EOrderStatus.PENDING],
    description: 'Selected order status filters',
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
}
