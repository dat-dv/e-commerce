import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class GetProductCategoryTreeUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoryRepository: IProductCategoriesRepository,
  ) {}

  async execute(languageCode = 'vi') {
    return this.categoryRepository.findTree(languageCode);
  }
}
