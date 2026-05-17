import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";

export interface IFavoritesStoreState {
  favorites: TUserFavoriteProductItem[];
  page: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
}

export interface IFavoritesStore extends IFavoritesStoreState {
  setFavorites: (favorites: TUserFavoriteProductItem[]) => void;
  appendFavorites: (favorites: TUserFavoriteProductItem[]) => void;
  addFavorite: (favorite: TUserFavoriteProductItem) => void;
  removeFavorite: (productId: string) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setHasMore: (hasMore: boolean) => void;
  hydrate: (data: Partial<IFavoritesStoreState>) => void;
}
