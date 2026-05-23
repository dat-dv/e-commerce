import { mapPaginatedData } from "@/utils/pagination";
import {
  ApiListResponse,
  ApiPaginatedResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
import {
  IGetUserFavoriteProductsRequest,
  IToggleUserFavoriteProductResponse as IToggleDTO,
  IUserFavoriteProductResponse,
} from "@ecommerce/shared";
import {
  TUserFavoriteProductItem,
  TUserFavoriteProductToggleResponse,
} from "../types/user-favorite-products.model";
import { IUserFavoriteProductsRepository } from "../types/user-favorite-products.repository";
import { UserFavoriteProductsMapper } from "./user-favorite-products.mapper";

export class UserFavoriteProductsRepository implements IUserFavoriteProductsRepository {
  constructor(private request: TRequest) {}

  async toggle(
    productId: string,
  ): Promise<ApiResponse<TUserFavoriteProductToggleResponse>> {
    const res = await this.request.post<IToggleDTO>(
      `/user-favorite-products/toggle/${productId}`,
    );

    return {
      ...res,
      data: UserFavoriteProductsMapper.toToggleDomain(res.data),
    };
  }

  async getUserFavoriteProducts(
    query?: IGetUserFavoriteProductsRequest,
  ): Promise<ApiPaginatedResponse<TUserFavoriteProductItem>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const response = await this.request.get<
      ApiListResponse<IUserFavoriteProductResponse>
    >("/user-favorite-products", {
      params: query,
    });

    return {
      ...response,
      data: mapPaginatedData(
        response.data,
        UserFavoriteProductsMapper.toDomain,
        {
          page,
          limit,
        },
      ),
    };
  }
}
