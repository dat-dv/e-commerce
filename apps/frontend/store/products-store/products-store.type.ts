import { THomepageSection } from "@/domain/homepage/types/homepage.model";

export interface IProductsStoreState {
  sections: THomepageSection[];
  loading: boolean;
}

export interface IProductsStore extends IProductsStoreState {
  setSections: (sections: THomepageSection[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: (data: Partial<IProductsStoreState>) => void;
}
