import { TProduct } from "@/domain/products/types/products.model";

export interface IProductsPageState {
  products: TProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  category_id: string | null;
  sort: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  search?: string;
}

export interface IProductsPageActions {
  setProducts: (
    products: TProduct[],
    total: number,
    totalPages: number,
  ) => void;
  setPage: (page: number) => void;
  setFilters: (
    filters: Partial<
      Pick<
        IProductsPageState,
        "category_id" | "sort" | "min_price" | "max_price" | "rating" | "search"
      >
    >,
  ) => void;
  clearFilter: (
    key: "sort" | "min_price" | "max_price" | "rating" | "search",
  ) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<IProductsPageState>) => void;
}

export type IProductsPageStore = IProductsPageState & IProductsPageActions;
