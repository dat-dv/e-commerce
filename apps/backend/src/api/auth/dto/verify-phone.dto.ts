import { IsString, IsNotEmpty } from 'class-validator';
import { IVerifyPhoneRequest } from '@ecommerce/shared';

export class VerifyPhoneDto implements IVerifyPhoneRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  phone_code: string;
}
