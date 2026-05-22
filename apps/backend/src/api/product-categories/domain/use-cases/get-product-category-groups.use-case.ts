import { Inject, Injectable } from '@nestjs/common';
import { GetCategoryGroupsDto } from '../../dto/get-category-groups.dto';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class GetProductCategoryGroupsUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(query: GetCategoryGroupsDto, languageCode = 'vi') {
    return this.categoriesRepository.findGroups(languageCode, query);
  }
}
