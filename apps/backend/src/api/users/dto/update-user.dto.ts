import { EGender, IUpdateUserRequest } from '@ecommerce/shared';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

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
  @Type(() => Number)
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

  @IsString()
  @IsOptional()
  role_id?: string;
}
