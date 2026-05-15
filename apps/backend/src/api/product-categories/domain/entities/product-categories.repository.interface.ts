import { ProductCategory, IPaginatedResult } from '@ecommerce/shared';

export interface IProductCategoriesRepository {
  create(data: { name: string; slug: string; description?: string }): Promise<ProductCategory>;
  update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<ProductCategory>;
  findMany(params?: { page?: number; limit?: number; level?: number }): Promise<IPaginatedResult<ProductCategory>>;
  findGroups(
    languageCode?: string,
    params?: { page?: number; limit?: number },
  ): Promise<IPaginatedResult<ProductCategory>>;
  findById(id: string, languageCode?: string): Promise<ProductCategory | null>;
  findTree(languageCode?: string): Promise<ProductCategory[]>;
  findTreeBySlug(slug: string, languageCode?: string): Promise<ProductCategory | null>;
  delete(id: string): Promise<ProductCategory>;
}

export const IProductCategoriesRepository = Symbol('IProductCategoriesRepository');
