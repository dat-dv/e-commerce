import { EAddressLabel, ICreateAddressInput } from '@ecommerce/shared';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateAddressDto implements ICreateAddressInput {
  @IsString()
  @IsNotEmpty()
  receiver_name: string;

  @IsString()
  @IsNotEmpty()
  receiver_phone: string;

  @IsEnum(EAddressLabel)
  label: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
