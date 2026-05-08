import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

import { PartialType, OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email', 'password'] as const)) {
  @IsString()
  newPassword: string;
}
