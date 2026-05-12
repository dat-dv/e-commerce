import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(params: { page?: number; limit?: number; search?: string; category_id?: string }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    return this.productsRepository.findPaginated({
      page,
      limit,
      search: params.search,
      category_id: params.category_id,
    });
  }
}
