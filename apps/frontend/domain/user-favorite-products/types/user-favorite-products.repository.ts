import {
  ApiPaginatedResponse,
  ApiResponse,
} from "@/utils/request/request.types";
import { IGetUserFavoriteProductsRequest } from "@ecommerce/shared";
import {
  TUserFavoriteProductItem,
  TUserFavoriteProductToggleResponse,
} from "./user-favorite-products.model";

export interface IUserFavoriteProductsRepository {
  toggle(
    productId: string,
  ): Promise<ApiResponse<TUserFavoriteProductToggleResponse>>;
  getUserFavoriteProducts(
    query?: IGetUserFavoriteProductsRequest,
  ): Promise<ApiPaginatedResponse<TUserFavoriteProductItem>>;
}
