import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateOrderReturnRequest } from '@ecommerce/shared';

export class CreateOrderReturnDto implements ICreateOrderReturnRequest {
  @ApiProperty({ description: 'Short title describing the return reason', example: 'Wrong item received' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    description: 'Detailed description',
    example: 'I ordered a blue shirt but received a red one.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, type: [String], description: 'IDs of uploaded images', example: ['cuid1', 'cuid2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image_ids?: string[];
}
