import { Inject, Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IBrand } from '@ecommerce/shared';

@Injectable()
export class GetBrandBySlugUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, languageCode?: string): Promise<IBrand | null> {
    return this.brandsRepository.getBrandBySlug(slug, languageCode);
  }
}
