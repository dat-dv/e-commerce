import { Inject, Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';

@Injectable()
export class GetBrandBySlugUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, languageCode = 'en') {
    return this.brandsRepository.getBrandBySlug(slug, languageCode);
  }
}
