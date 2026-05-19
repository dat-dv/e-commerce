import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUpdateOrderReturnStatusRequest, EOrderReturnStatus } from '@ecommerce/shared';

export class UpdateOrderReturnStatusDto implements IUpdateOrderReturnStatusRequest {
  @ApiProperty({ enum: EOrderReturnStatus, example: EOrderReturnStatus.APPROVED })
  @IsNotEmpty()
  @IsEnum(EOrderReturnStatus)
  status: EOrderReturnStatus;

  @ApiProperty({ required: false, example: 'Item condition is not acceptable for return.' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false, example: 'Refund will be processed within 3-5 business days.' })
  @IsOptional()
  @IsString()
  note?: string;
}
