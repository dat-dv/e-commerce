import { Injectable, Inject } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { EProductSort } from '@ecommerce/shared';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async execute(params: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    category_slug?: string;
    brand_id?: string;
    min_price?: number;
    max_price?: number;
    attribute_value_ids?: string[];
    sort?: EProductSort;
    languageCode?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    return this.productsRepository.findPaginated({
      page,
      limit,
      search: params.search,
      category_id: params.category_id,
      category_slug: params.category_slug,
      brand_id: params.brand_id,
      min_price: params.min_price,
      max_price: params.max_price,
      attribute_value_ids: params.attribute_value_ids,
      sort: params.sort,
      languageCode: params.languageCode,
    });
  }
}
