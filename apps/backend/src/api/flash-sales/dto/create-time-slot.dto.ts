import { ICreateTimeSlotRequest, ICreateTimeSlotsBatchRequest } from '@ecommerce/shared';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTimeSlotDto implements ICreateTimeSlotRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(23)
  start_hour: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(59)
  start_minute?: number;

  @IsNumber()
  @Min(0)
  @Max(23)
  end_hour: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(59)
  end_minute?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CreateTimeSlotsBatchDto implements ICreateTimeSlotsBatchRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTimeSlotDto)
  slots: CreateTimeSlotDto[];
}
