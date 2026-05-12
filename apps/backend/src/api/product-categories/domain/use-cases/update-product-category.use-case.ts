import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class UpdateProductCategoryUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(id: string, data: { name?: string; slug?: string; description?: string }) {
    return this.categoriesRepository.update(id, data);
  }
}
