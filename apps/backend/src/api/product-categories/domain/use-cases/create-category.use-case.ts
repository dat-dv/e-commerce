import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

import { CreateCategoryDto } from '../../dto/create-product-category.dto';

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(data: CreateCategoryDto) {
    return this.categoriesRepository.create(data);
  }
}
