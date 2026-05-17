import {
  ApiResponse,
  ApiPaginatedResponse,
} from "@/utils/request/request.types";
import {
  TUserFavoriteProductItem,
  TUserFavoriteProductToggleResponse,
} from "./user-favorite-products.model";

export interface IUserFavoriteProductsRepository {
  toggle(
    productId: string,
  ): Promise<ApiResponse<TUserFavoriteProductToggleResponse>>;
  getUserFavoriteProducts(
    page: number,
    limit: number,
  ): Promise<ApiPaginatedResponse<TUserFavoriteProductItem>>;
}
