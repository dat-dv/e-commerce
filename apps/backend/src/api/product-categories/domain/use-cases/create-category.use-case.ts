import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(data: { name: string; slug: string; description?: string }) {
    return this.categoriesRepository.create(data);
  }
}
