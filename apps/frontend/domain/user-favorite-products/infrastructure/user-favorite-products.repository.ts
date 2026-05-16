import { IUserFavoriteProductsRepository } from "../types/user-favorite-products.repository";
import {
  ApiResponse,
  TRequest,
  ApiListResponse,
} from "@/utils/request/request.types";
import {
  TUserFavoriteProductItem,
  TUserFavoriteProductToggleResponse,
} from "../types/user-favorite-products.model";
import { UserFavoriteProductsMapper } from "./user-favorite-products.mapper";
import {
  IUserFavoriteProductResponse,
  IToggleUserFavoriteProductResponse as IToggleDTO,
} from "@ecommerce/shared";

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
    page: number,
    limit: number,
  ): Promise<ApiResponse<TUserFavoriteProductItem[]>> {
    const res = await this.request.get<
      ApiListResponse<IUserFavoriteProductResponse>
    >("/user-favorite-products", {
      params: { page, limit },
    });

    return {
      ...res,
      data:
        res.data?.items?.map((item) =>
          UserFavoriteProductsMapper.toDomain(item),
        ) || [],
      meta: res.data?.meta,
    } as ApiResponse<TUserFavoriteProductItem[]>;
  }
}
