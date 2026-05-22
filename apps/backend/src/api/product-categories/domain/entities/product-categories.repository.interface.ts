import { ICategoryResponse, IPaginatedResult } from '@ecommerce/shared';
import { CreateCategoryDto } from '../../dto/create-product-category.dto';
import { GetCategoriesDto } from '../../dto/get-categories.dto';
import { GetCategoryGroupsDto } from '../../dto/get-category-groups.dto';
import { UpdateCategoryDto } from '../../dto/update-product-category.dto';

export interface IProductCategoriesRepository {
  create(data: CreateCategoryDto): Promise<ICategoryResponse>;
  update(id: string, data: UpdateCategoryDto): Promise<ICategoryResponse>;
  findMany(params?: GetCategoriesDto): Promise<IPaginatedResult<ICategoryResponse>>;
  findGroups(languageCode?: string, params?: GetCategoryGroupsDto): Promise<IPaginatedResult<ICategoryResponse>>;
  findById(id: string, languageCode?: string): Promise<ICategoryResponse | null>;
  findTree(languageCode?: string): Promise<ICategoryResponse[]>;
  findTreeBySlug(slug: string, languageCode?: string): Promise<ICategoryResponse | null>;
  delete(id: string): Promise<ICategoryResponse>;
}

export const IProductCategoriesRepository = Symbol('IProductCategoriesRepository');
