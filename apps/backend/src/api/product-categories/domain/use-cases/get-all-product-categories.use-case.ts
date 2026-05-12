import { Injectable, Inject } from '@nestjs/common';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class GetAllProductCategoriesUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
  ) {}

  async execute() {
    return this.categoriesRepository.findAll();
  }
}
