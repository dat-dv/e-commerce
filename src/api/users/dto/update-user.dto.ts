import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

import { PartialType, OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password', 'confirm_password'] as const),
) {}

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  new_password: string;

  @IsString()
  confirm_password: string;
}
