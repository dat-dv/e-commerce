import { EProductSort } from "@ecommerce/shared";
import { TProduct } from "@/domain/products/types/products.model";

export type CategoryProductsFilterKey =
  | "sort"
  | "min_price"
  | "max_price"
  | "rating"
  | "search";

export interface ICategoryProductsFilters {
  sort: EProductSort | `${EProductSort}`;
  search?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
}

export interface ICategoryProductsState extends ICategoryProductsFilters {
  products: TProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

export interface ICategoryProductsActions {
  setProducts: (
    products: TProduct[],
    total: number,
    totalPages: number,
  ) => void;

  setPage: (page: number) => void;

  setFilters: (filters: Partial<ICategoryProductsFilters>) => void;

  clearFilter: (key: CategoryProductsFilterKey) => void;

  resetFilters: () => void;

  setLoading: (loading: boolean) => void;

  hydrate: (data: Partial<ICategoryProductsState>) => void;
}

export type ICategoryProductsStore = ICategoryProductsState &
  ICategoryProductsActions;
