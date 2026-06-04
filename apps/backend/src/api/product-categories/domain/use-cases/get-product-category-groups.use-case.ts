import { Inject, Injectable } from '@nestjs/common';
import { GetCategoryGroupsDto } from '../../dto/get-category-groups.dto';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetProductCategoryGroupsUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute(query: GetCategoryGroupsDto, languageCode = DEFAULT_LANGUAGE_CODE) {
    return this.categoriesRepository.findGroups(languageCode, query);
  }
}
