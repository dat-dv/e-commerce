import { Inject, Injectable } from '@nestjs/common';
import { GetBrandListDto } from '../../dto/get-brand-list.dto';
import { IBrandsRepository } from '../entities/brands.repository.interface';

@Injectable()
export class GetBrandListUseCase {
  constructor(
    @Inject(IBrandsRepository)
    private readonly brandsRepository: IBrandsRepository,
  ) {}

  async execute(query: GetBrandListDto, lang: string) {
    return this.brandsRepository.getBrandList(query, lang);
  }
}
