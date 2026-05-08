import { Max, Min, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRolesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 25;
}
