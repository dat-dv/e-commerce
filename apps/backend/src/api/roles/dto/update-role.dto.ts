import { IUpdateRoleRequest } from '@ecommerce/shared';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateRoleDto implements IUpdateRoleRequest {
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Role name must not exceed 50 characters' })
  role_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;
}
