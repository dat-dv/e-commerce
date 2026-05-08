import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, MaxLength, IsEnum, ArrayMaxSize } from 'class-validator';
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

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsEnum(IPostStatus)
  @IsOptional()
  status?: IPostStatus = IPostStatus.DRAFT;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMaxSize(10, { message: 'A post can have at most 10 tags' })
  tag_ids?: string[] = [];
}
