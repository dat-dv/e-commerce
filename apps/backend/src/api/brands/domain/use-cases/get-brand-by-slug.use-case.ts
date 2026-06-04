import { Inject, Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetBrandBySlugUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, languageCode = DEFAULT_LANGUAGE_CODE) {
    return this.brandsRepository.getBrandBySlug(slug, languageCode);
  }
}
