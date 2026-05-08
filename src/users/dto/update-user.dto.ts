import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

import { PartialType, OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password', 'confirmPassword'] as const),
) {}

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
