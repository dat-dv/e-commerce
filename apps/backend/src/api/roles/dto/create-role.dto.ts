import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ICreateRoleRequest } from '@ecommerce/shared';

export class CreateRoleDto implements ICreateRoleRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Role name must not exceed 50 characters' })
  role_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}
