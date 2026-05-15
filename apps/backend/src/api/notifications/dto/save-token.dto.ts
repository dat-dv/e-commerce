import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ISaveTokenRequest } from '@ecommerce/shared';

export class SaveTokenDto implements ISaveTokenRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  deviceType?: string;
}
