import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Permission name must not exceed 50 characters' })
  permission_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;

  @IsString()
  @IsOptional()
  category_id?: string;
}
