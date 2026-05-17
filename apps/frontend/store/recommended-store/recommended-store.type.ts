import { TProduct } from "@/domain/products/types/products.model";

export interface IRecommendedStoreState {
  recommendedProducts: TProduct[];
  page: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
}

export interface IRecommendedStore extends IRecommendedStoreState {
  setRecommendedProducts: (products: TProduct[]) => void;

  appendRecommendedProducts: (products: TProduct[]) => void;

  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setHasMore: (hasMore: boolean) => void;
  hydrate: (data: Partial<IRecommendedStoreState>) => void;
}
