import {
  IUserFavoriteProductResponse,
  IToggleUserFavoriteProductResponse as IToggleDTO,
} from "@ecommerce/shared";
import {
  TUserFavoriteProductItem,
  TUserFavoriteProductToggleResponse,
} from "../types/user-favorite-products.model";
import { ProductMapper } from "../../products/infrastructure/products.mapper";

export class UserFavoriteProductsMapper {
  static toDomain(dto: IUserFavoriteProductResponse): TUserFavoriteProductItem {
    const product = dto.product
      ? ProductMapper.toDomain(dto.product)
      : undefined;
    if (product) {
      product.isFavorited = true;
    }
    return {
      userId: dto.user_id,
      productId: dto.product_id,
      createdAt: dto.created_at.toString(),
      product,
    };
  }

  static toToggleDomain(dto: IToggleDTO): TUserFavoriteProductToggleResponse {
    return {
      isFavorited: dto.is_favorited,
      productId: dto.product_id,
    };
  }
}
