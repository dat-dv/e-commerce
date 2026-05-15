import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';
import { GetCategoriesDto } from '../../dto/get-categories.dto';

@Injectable()
export class GetAllProductCategoriesUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoryRepository: IProductCategoriesRepository,
  ) {}

  async execute(dto: GetCategoriesDto) {
    return this.categoryRepository.findMany(dto);
  }
}
