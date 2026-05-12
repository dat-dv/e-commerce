import { IProduct } from "@/domain/products/types/products.model";
import { IHomepageSection } from "@/domain/homepage/types/homepage.model";
import { ICategory } from "@/domain/categories/types/categories.model";

export interface IProductsStoreState {
  flashSaleProducts: IProduct[];
  recommendedProducts: IProduct[];
  sections: IHomepageSection[];
  categories: ICategory[];
  lang: string;
  loading: boolean;
}

export interface IProductsStore extends IProductsStoreState {
  setFlashSaleProducts: (products: IProduct[]) => void;
  setRecommendedProducts: (products: IProduct[]) => void;
  setSections: (sections: IHomepageSection[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<IProductsStoreState>) => void;
}
