import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductsRepository } from '../entities/products.repository.interface';
import { IProductDetailResponse } from '@ecommerce/shared';
import { IUserFavoriteProductsRepository } from 'src/api/user-favorite-products/domain/entities/user-favorite-products.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetProductDetailUseCase {
  constructor(
    @Inject(IProductsRepository)
    private readonly productsRepository: IProductsRepository,
    @Inject(IUserFavoriteProductsRepository)
    private readonly userFavoriteProductsRepository: IUserFavoriteProductsRepository,
  ) {}

  async execute(
    slug: string,
    languageCode = DEFAULT_LANGUAGE_CODE,
    userId?: string,
    options?: { allTranslations?: boolean },
  ): Promise<IProductDetailResponse> {
    const product = await this.productsRepository.findBySlug(slug, languageCode, options);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (userId) {
      try {
        await this.productsRepository.recordView(userId, product.id);
        product.is_favorited = await this.userFavoriteProductsRepository.isFavorited(userId, product.id);
      } catch (error) {
        console.error('Failed to record product view or check favorite:', error);
      }
    }

    return product;
  }
}
