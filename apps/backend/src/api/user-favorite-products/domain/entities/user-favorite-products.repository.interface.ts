import { IUserFavoriteProductResponse, IToggleUserFavoriteProductResponse, IPaginatedResult } from '@ecommerce/shared';

export interface IUserFavoriteProductsRepository {
  toggle(userId: string, productId: string): Promise<IToggleUserFavoriteProductResponse>;
  isFavorited(userId: string, productId: string): Promise<boolean>;
  getUserFavoriteProducts(
    userId: string,
    page?: number,
    limit?: number,
    languageCode?: string,
  ): Promise<IPaginatedResult<IUserFavoriteProductResponse>>;
}

export const IUserFavoriteProductsRepository = Symbol('IUserFavoriteProductsRepository');
