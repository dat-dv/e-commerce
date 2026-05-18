import type {
  IBrandResponse,
  IPaginatedResult,
  IProductResponse,
  IBrandProductsResponse,
  ICategoryResponse,
} from '@ecommerce/shared';

export interface IBrandsRepository {
  getTopBrands(page: number, limit: number, languageCode?: string): Promise<IPaginatedResult<IBrandResponse>>;

  getBrandBySlug(slug: string, languageCode?: string): Promise<IBrandResponse | null>;

  getBrandProducts(
    slug: string,
    page: number,
    limit: number,
    languageCode?: string,
    search?: string,
    category?: string,
  ): Promise<IBrandProductsResponse>;

  getBrandCategoryTree(slug: string, languageCode?: string): Promise<ICategoryResponse[]>;
}

export const IBrandsRepository = Symbol('IBrandsRepository');
