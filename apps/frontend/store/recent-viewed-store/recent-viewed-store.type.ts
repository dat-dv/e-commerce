import { TProduct } from "@/domain/products/types/products.model";

export interface IRecentViewedStoreState {
  recentViewedProducts: TProduct[];
  page: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
}

export interface IRecentViewedStore extends IRecentViewedStoreState {
  setRecentViewedProducts: (products: TProduct[]) => void;

  appendRecentViewedProducts: (products: TProduct[]) => void;

  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setHasMore: (hasMore: boolean) => void;
  hydrate: (data: Partial<IRecentViewedStoreState>) => void;
}
