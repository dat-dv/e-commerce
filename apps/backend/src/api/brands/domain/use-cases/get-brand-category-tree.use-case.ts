import { Injectable, Inject } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { ICategoryResponse } from '@ecommerce/shared';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetBrandCategoryTreeUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, languageCode = DEFAULT_LANGUAGE_CODE): Promise<ICategoryResponse[]> {
    return this.brandsRepository.getBrandCategoryTree(slug, languageCode);
  }
}
