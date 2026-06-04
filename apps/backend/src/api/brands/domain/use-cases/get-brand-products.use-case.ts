import { Inject, Injectable } from '@nestjs/common';
import { GetBrandProductsDto } from '../../dto/get-brand-products.dto';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetBrandProductsUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, query: GetBrandProductsDto, languageCode = DEFAULT_LANGUAGE_CODE) {
    return this.brandsRepository.getBrandProducts(slug, query, languageCode);
  }
}
