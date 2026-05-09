import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, MaxLength, IsEnum, ArrayMaxSize } from 'class-validator';
import { IPostStatus } from 'generated/prisma/client';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }): object => {
    try {
      return typeof value === 'string' ? (JSON.parse(value) as object) : (value as object);
    } catch {
      return value as object;
    }
  })
  content: object;

  @IsEnum(IPostStatus)
  @IsOptional()
  status?: IPostStatus = IPostStatus.DRAFT;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMaxSize(10, { message: 'A post can have at most 10 tags' })
  @Transform(({ value }): string[] => {
    if (value === '') return [];
    try {
      return typeof value === 'string' ? (JSON.parse(value) as string[]) : (value as string[]);
    } catch {
      return value as string[];
    }
  })
  tag_ids?: string[] = [];
}
