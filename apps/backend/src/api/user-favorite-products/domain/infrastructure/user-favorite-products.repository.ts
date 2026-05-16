import { Injectable } from '@nestjs/common';
import { IUserFavoriteProductsRepository } from '../entities/user-favorite-products.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { IUserFavoriteProductResponse, IToggleUserFavoriteProductResponse, IPaginatedResult } from '@ecommerce/shared';

@Injectable()
export class UserFavoriteProductsRepository implements IUserFavoriteProductsRepository {
  private getUserFavoriteProductsInclude(languageCode: string) {
    return {
      product: {
        include: {
          thumbnail: true,
          skus: true,
          brand: true,
          translations: {
            where: { language: { code: languageCode } },
          },
        },
      },
    };
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async toggle(userId: string, productId: string): Promise<IToggleUserFavoriteProductResponse> {
    const isFavorited = await this.isFavorited(userId, productId);

    if (isFavorited) {
      await this.prisma.userFavoriteProduct.deleteMany({
        where: {
          user_id: userId,
          product_id: productId,
        },
      });
      return { is_favorited: false, product_id: productId };
    }

    await this.prisma.userFavoriteProduct.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });

    return { is_favorited: true, product_id: productId };
  }

  async isFavorited(userId: string, productId: string): Promise<boolean> {
    const count = await this.prisma.userFavoriteProduct.count({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
    return count > 0;
  }

  async getUserFavoriteProducts(
    userId: string,
    page = 1,
    limit = 10,
    languageCode = 'vi',
  ): Promise<IPaginatedResult<IUserFavoriteProductResponse>> {
    return this.paginationService.paginate(
      this.prisma.userFavoriteProduct,
      {
        where: { user_id: userId },
        include: this.getUserFavoriteProductsInclude(languageCode),
        orderBy: { created_at: 'desc' },
      },
      page,
      limit,
    );
  }
}
