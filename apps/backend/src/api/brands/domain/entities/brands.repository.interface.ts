import { Brand, IPaginatedResult, Product, IBrandProductsResponse } from '@ecommerce/shared';

export interface IBrandsRepository {
  getTopBrands(page: number, limit: number, languageCode?: string): Promise<IPaginatedResult<Brand>>;

  getBrandBySlug(slug: string, languageCode?: string): Promise<Brand | null>;

  getBrandProducts(slug: string, page: number, limit: number, languageCode?: string): Promise<IBrandProductsResponse>;
}

export const IBrandsRepository = Symbol('IBrandsRepository');
