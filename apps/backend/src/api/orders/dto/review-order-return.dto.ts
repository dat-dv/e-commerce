import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IReviewOrderReturnRequest, EOrderReturnStatus } from '@ecommerce/shared';

export class ReviewOrderReturnDto implements IReviewOrderReturnRequest {
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
