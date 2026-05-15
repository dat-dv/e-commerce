import { Injectable, Inject } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';

@Injectable()
export class GetTopBrandsUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(page = 1, limit = 10, languageCode = 'vi') {
    return this.brandsRepository.getTopBrands(page, limit, languageCode);
  }
}
