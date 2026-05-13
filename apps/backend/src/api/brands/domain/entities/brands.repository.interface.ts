import { IBrand } from '@ecommerce/shared';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IBrandsRepository {
  getTopBrands(page: number, limit: number, languageCode?: string): Promise<PaginatedResult<IBrand>>;
  getBrandBySlug(slug: string, languageCode?: string): Promise<IBrand | null>;
  getBrandProducts(slug: string, page: number, limit: number, languageCode?: string): Promise<PaginatedResult<any>>;
}

export const IBrandsRepository = Symbol('IBrandsRepository');
