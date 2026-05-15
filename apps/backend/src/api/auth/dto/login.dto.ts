import { IsEmail, IsString, MinLength } from 'class-validator';
import { ILoginRequest } from '@ecommerce/shared';

export class LoginDto implements ILoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
