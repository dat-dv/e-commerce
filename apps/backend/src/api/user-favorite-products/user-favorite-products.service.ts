import { Injectable, Inject } from '@nestjs/common';
import { IUserFavoriteProductsRepository } from './domain/entities/user-favorite-products.repository.interface';
import { IUserFavoriteProductResponse, IToggleUserFavoriteProductResponse, IPaginatedResult } from '@ecommerce/shared';

@Injectable()
export class UserFavoriteProductsService {
  constructor(
    @Inject(IUserFavoriteProductsRepository)
    private readonly userFavoriteProductsRepository: IUserFavoriteProductsRepository,
  ) {}

  async toggle(userId: string, productId: string): Promise<IToggleUserFavoriteProductResponse> {
    return this.userFavoriteProductsRepository.toggle(userId, productId);
  }

  async getUserFavoriteProducts(
    userId: string,
    page?: number,
    limit?: number,
    languageCode?: string,
  ): Promise<IPaginatedResult<IUserFavoriteProductResponse>> {
    return this.userFavoriteProductsRepository.getUserFavoriteProducts(userId, page, limit, languageCode);
  }
}
