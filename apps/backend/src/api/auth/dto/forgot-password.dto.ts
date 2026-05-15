import { IsEmail } from 'class-validator';
import { IForgotPasswordRequest } from '@ecommerce/shared';

export class ForgotPasswordDto implements IForgotPasswordRequest {
  @IsEmail()
  email: string;
}
