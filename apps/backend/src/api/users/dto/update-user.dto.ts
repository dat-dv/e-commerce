import { IsDate, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

import { PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password', 'confirm_password'] as const),
) {
  @IsString()
  id: string;

  @Type(() => Date)
  @IsDate()
  date_of_birth: Date;
}

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  new_password: string;

  @IsString()
  confirm_password: string;
}
