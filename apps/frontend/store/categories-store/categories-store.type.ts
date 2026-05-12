import { ICategory } from "@/domain/categories/types/categories.model";

export interface ICategoriesStoreState {
  categories: ICategory[];
  loading: boolean;
}

export interface ICategoriesStore extends ICategoriesStoreState {
  setCategories: (categories: ICategory[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<ICategoriesStoreState>) => void;
}
