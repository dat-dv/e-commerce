import { Injectable, Inject } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { ICategoryResponse } from '@ecommerce/shared';

@Injectable()
export class GetBrandCategoryTreeUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, languageCode = 'vi'): Promise<ICategoryResponse[]> {
    return this.brandsRepository.getBrandCategoryTree(slug, languageCode);
  }
}
