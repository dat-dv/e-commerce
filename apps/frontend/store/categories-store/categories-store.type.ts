import { TCategory } from "@/domain/categories/types/categories.model";
import { IPaginationMeta } from "@/utils/request/request.types";

export interface ICategoriesStoreState {
  categories: TCategory[];
  loading: boolean;
  pagination?: IPaginationMeta;
}

export interface ICategoriesStore extends ICategoriesStoreState {
  setCategories: (categories: TCategory[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<ICategoriesStoreState>) => void;
}
