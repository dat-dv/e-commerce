import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, MaxLength, IsEnum } from 'class-validator';
import { IPostStatus } from 'generated/prisma/enums';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150, { message: 'Title must not exceed 150 characters' })
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsObject()
  @IsNotEmpty()
  content: object;

  @IsEnum(IPostStatus)
  @IsOptional()
  status?: IPostStatus;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tag_ids?: string[];
}
