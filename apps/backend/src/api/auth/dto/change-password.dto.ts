import { IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { IChangePasswordRequest } from '@ecommerce/shared';

export class ChangePasswordDto implements IChangePasswordRequest {
  @IsString()
  old_password: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  new_password: string;

  @IsString()
  @Match('new_password', { message: 'Passwords do not match' })
  confirm_password: string;
}
