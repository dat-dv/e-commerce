import { IUser, Gender, Prettify } from '@ecommerce/shared';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';

export class UpdateUserDto implements Omit<
  IUser,
  'created_at' | 'updated_at' | 'deleted_at' | 'role_id' | 'avatar_id' | 'email'
> {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_of_birth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  @Type(() => Number)
  gender?: number;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  phone_code?: string;
}

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  new_password: string;

  @IsString()
  confirm_password: string;
}
