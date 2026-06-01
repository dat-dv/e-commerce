import { EGender, IUpdateUserRequest } from '@ecommerce/shared';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements IUpdateUserRequest {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  @IsEnum(EGender)
  @IsOptional()
  @Type(() => Number)
  gender?: number;

  @IsString()
  @IsOptional()
  avatar_id?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  phone_code?: string;

  @IsString()
  @IsOptional()
  role_id?: string;
}
