import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class GetProductCategoryTreeBySlugUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(languageCode: string = 'vi', slug: string) {
    return this.categoriesRepository.findTreeBySlug(slug, languageCode);
  }
}
