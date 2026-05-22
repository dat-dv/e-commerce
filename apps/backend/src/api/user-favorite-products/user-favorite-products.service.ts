import { IPaginatedResult, IToggleUserFavoriteProductResponse, IUserFavoriteProductResponse } from '@ecommerce/shared';
import { Inject, Injectable } from '@nestjs/common';
import { IUserFavoriteProductsRepository } from './domain/entities/user-favorite-products.repository.interface';
import { GetUserFavoriteProductsDto } from './dto/get-user-favorite-products.dto';

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
    query?: GetUserFavoriteProductsDto,
    languageCode?: string,
  ): Promise<IPaginatedResult<IUserFavoriteProductResponse>> {
    return this.userFavoriteProductsRepository.getUserFavoriteProducts(userId, query, languageCode);
  }
}
