import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
  @Match('password', { message: 'Confirm password must match password' })
  confirm_password: string;

  @IsString()
  @MinLength(6, { message: 'First name must be at least 6 characters long' })
  first_name: string;

  @IsString()
  @MinLength(6, { message: 'Last name must be at least 6 characters long' })
  last_name: string;
}
