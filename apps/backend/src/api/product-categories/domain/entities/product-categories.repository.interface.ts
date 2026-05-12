import { IProductCategory } from './product-category.entity';

export interface IProductCategoriesRepository {
  create(data: { name: string; slug: string; description?: string }): Promise<IProductCategory>;
  update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<IProductCategory>;
  findAll(): Promise<IProductCategory[]>;
  findGroups(languageCode?: string): Promise<IProductCategory[]>;
  findById(id: string, languageCode?: string): Promise<IProductCategory | null>;
  findTree(languageCode?: string): Promise<IProductCategory[]>;
  delete(id: string): Promise<IProductCategory>;
}

export const IProductCategoriesRepository = Symbol('IProductCategoriesRepository');
