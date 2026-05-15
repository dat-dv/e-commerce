import type { IBrandResponse, IPaginatedResult, IProductResponse, IBrandProductsResponse } from '@ecommerce/shared';

export interface IBrandsRepository {
  getTopBrands(page: number, limit: number, languageCode?: string): Promise<IPaginatedResult<IBrandResponse>>;

  getBrandBySlug(slug: string, languageCode?: string): Promise<IBrandResponse | null>;

  getBrandProducts(slug: string, page: number, limit: number, languageCode?: string): Promise<IBrandProductsResponse>;
}

export const IBrandsRepository = Symbol('IBrandsRepository');
