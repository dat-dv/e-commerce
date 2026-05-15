import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-product-category.dto';
import { IUpdateCategoryRequest } from '@ecommerce/shared';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) implements IUpdateCategoryRequest {}
