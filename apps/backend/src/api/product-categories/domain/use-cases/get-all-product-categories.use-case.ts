import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class GetAllProductCategoriesUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoryRepository: IProductCategoriesRepository,
  ) {}

  async execute(params: { page?: number; limit?: number; level?: number }) {
    return this.categoryRepository.findMany(params);
  }
}
