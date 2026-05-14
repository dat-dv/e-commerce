import { TProduct } from "@/domain/products/types/products.model";
import { THomepageSection } from "@/domain/homepage/types/homepage.model";

export interface IProductsStoreState {
  flashSaleProducts: TProduct[];
  recommendedProducts: TProduct[];
  sections: THomepageSection[];
  loading: boolean;
}

export interface IProductsStore extends IProductsStoreState {
  setFlashSaleProducts: (products: TProduct[]) => void;
  setRecommendedProducts: (products: TProduct[]) => void;
  setSections: (sections: THomepageSection[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<IProductsStoreState>) => void;
}
