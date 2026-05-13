import { Injectable, Inject } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IBrand } from 'src/api/homepage/domain/entities/homepage-section.entity';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class GetTopBrandsUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(page = 1, limit = 10, languageCode = 'vi'): Promise<PaginatedResult<IBrand>> {
    return this.brandsRepository.getTopBrands(page, limit, languageCode);
  }
}
