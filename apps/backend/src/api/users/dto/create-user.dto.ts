import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ICreateUserRequest } from '@ecommerce/shared';

export class CreateUserDto implements ICreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  confirm_password: string;
}
