import { IsString, IsOptional, IsEnum, MinLength, IsDateString } from 'class-validator';
import { IUpdateUserRequest, EGender } from '@ecommerce/shared';

export class UpdateUserDto implements IUpdateUserRequest {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  @IsEnum(EGender)
  @IsOptional()
  gender?: number;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  phone_code?: string;
}
