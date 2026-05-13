import { Inject, Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class GetBrandProductsUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(slug: string, page: number, limit: number, languageCode?: string): Promise<PaginatedResult<any>> {
    return this.brandsRepository.getBrandProducts(slug, page, limit, languageCode);
  }
}
