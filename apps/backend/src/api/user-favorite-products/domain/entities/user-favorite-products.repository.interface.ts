import { IPaginatedResult, IToggleUserFavoriteProductResponse, IUserFavoriteProductResponse } from '@ecommerce/shared';

import { GetUserFavoriteProductsDto } from '../../dto/get-user-favorite-products.dto';

export interface IUserFavoriteProductsRepository {
  toggle(userId: string, productId: string): Promise<IToggleUserFavoriteProductResponse>;
  isFavorited(userId: string, productId: string): Promise<boolean>;
  getUserFavoriteProducts(
    userId: string,
    query?: GetUserFavoriteProductsDto,
    languageCode?: string,
  ): Promise<IPaginatedResult<IUserFavoriteProductResponse>>;
}

export const IUserFavoriteProductsRepository = Symbol('IUserFavoriteProductsRepository');
