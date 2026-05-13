import { IBrand } from 'src/api/homepage/domain/entities/homepage-section.entity';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IBrandsRepository {
  getTopBrands(page: number, limit: number, languageCode?: string): Promise<PaginatedResult<IBrand>>;
}

export const IBrandsRepository = Symbol('IBrandsRepository');
