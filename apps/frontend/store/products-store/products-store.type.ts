import { IProduct } from "@/domain/products/types/products.model";

export interface IProductsStoreState {
  flashSaleProducts: IProduct[];
  recommendedProducts: IProduct[];
  loading: boolean;
}

export interface IProductsStore extends IProductsStoreState {
  setFlashSaleProducts: (products: IProduct[]) => void;
  setRecommendedProducts: (products: IProduct[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<IProductsStoreState>) => void;
}
