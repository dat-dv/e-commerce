import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ICreatePermissionRequest } from '@ecommerce/shared';

export class CreatePermissionDto implements ICreatePermissionRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Permission name must not exceed 50 characters' })
  permission_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;

  @IsString()
  @IsNotEmpty()
  module: string;
}
