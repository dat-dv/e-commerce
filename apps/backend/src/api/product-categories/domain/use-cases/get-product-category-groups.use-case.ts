import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class GetProductCategoryGroupsUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(languageCode: string = 'vi', params?: { page?: number; limit?: number }) {
    return this.categoriesRepository.findGroups(languageCode, params);
  }
}
