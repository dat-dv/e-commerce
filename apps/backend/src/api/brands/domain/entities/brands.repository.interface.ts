import type { IBrandProductsResponse, IBrandResponse, ICategoryResponse, IPaginatedResult } from '@ecommerce/shared';
import { GetBrandListDto } from '../../dto/get-brand-list.dto';
import { GetBrandProductsDto } from '../../dto/get-brand-products.dto';

export interface IBrandsRepository {
  getBrandList(query: GetBrandListDto, languageCode?: string): Promise<IPaginatedResult<IBrandResponse>>;

  getBrandBySlug(slug: string, languageCode?: string): Promise<IBrandResponse | null>;

  getBrandProducts(slug: string, query: GetBrandProductsDto, languageCode?: string): Promise<IBrandProductsResponse>;

  getBrandCategoryTree(slug: string, languageCode?: string): Promise<ICategoryResponse[]>;
}

export const IBrandsRepository = Symbol('IBrandsRepository');
