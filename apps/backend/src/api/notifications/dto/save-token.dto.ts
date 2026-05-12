import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SaveTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  deviceType?: string;
}
