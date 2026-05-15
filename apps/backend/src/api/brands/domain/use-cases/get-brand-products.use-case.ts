import { Injectable, Inject } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';

@Injectable()
export class GetBrandProductsUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, page = 1, limit = 10, languageCode = 'vi') {
    return this.brandsRepository.getBrandProducts(slug, page, limit, languageCode);
  }
}
