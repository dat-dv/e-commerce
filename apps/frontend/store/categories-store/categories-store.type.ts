import { TCategory } from "@/domain/categories/types/categories.model";
import { IPaginationMeta } from "@/utils/request/request.types";

export interface TCategoryNavigationContext {
  path: TCategory[];
  activeCategory?: TCategory;
  topCategory?: TCategory;
  relatedCategories: TCategory[];
}

export interface ICategoriesStoreState {
  categories: TCategory[];
  loading: boolean;
  pagination?: IPaginationMeta;
}

export interface ICategoriesStore extends ICategoriesStoreState {
  setCategories: (categories: TCategory[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<ICategoriesStoreState>) => void;
  findCategoryPath: (slug: string) => TCategory[];
  getCategoryNavigationContext: (slug: string) => TCategoryNavigationContext;
}
