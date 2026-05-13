import { IProductsRepository } from "../types/products.repository";

/**
 * Use case to get products with filters.
 */
export class GetProductsUseCase {
  constructor(private repository: IProductsRepository) {}

  execute(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    category_slug?: string;
    brand_id?: string;
    min_price?: number;
    max_price?: number;
    attribute_value_ids?: string[];
    sort?: string;
    languageCode?: string;
  }) {
    return this.repository.getProducts(params);
  }
}
