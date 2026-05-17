import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateHelpContactSubmissionDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  contact_name?: string;

  @ValidateIf((dto: CreateHelpContactSubmissionDto) => !!dto.contact_email || !dto.contact_phone)
  @IsEmail()
  @IsNotEmpty()
  contact_email?: string;

  @ValidateIf((dto: CreateHelpContactSubmissionDto) => !!dto.contact_phone || !dto.contact_email)
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  contact_phone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @IsOptional()
  image_ids?: string[];
}
