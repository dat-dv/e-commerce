import { Max, Min, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  limit: number = 10;
}
