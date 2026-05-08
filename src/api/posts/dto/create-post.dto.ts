import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150, { message: 'Title must not exceed 150 characters' })
  title: string;

  @IsObject()
  @IsNotEmpty()
  content: object;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tag_ids?: string[];
}
