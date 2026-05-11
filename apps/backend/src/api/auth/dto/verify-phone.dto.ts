import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPhoneDto {
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
