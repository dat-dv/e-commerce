import { Inject, Injectable } from '@nestjs/common';
import { GetBrandProductsDto } from '../../dto/get-brand-products.dto';
import { IBrandsRepository } from '../entities/brands.repository.interface';

@Injectable()
export class GetBrandProductsUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, query: GetBrandProductsDto, languageCode = 'en') {
    return this.brandsRepository.getBrandProducts(slug, query, languageCode);
  }
}
