import { Injectable, Inject } from '@nestjs/common';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { EHomepageSectionType, IHomepageSectionResponse } from '@ecommerce/shared';
import { IProductsRepository } from 'src/api/products/domain/entities/products.repository.interface';
import { DEFAULT_LANGUAGE_CODE } from 'src/common/constants/app.constant';

@Injectable()
export class GetHomepageSectionsUseCase {
  constructor(
    @Inject(IHomepageSectionRepository)
    private readonly homepageSectionRepo: IHomepageSectionRepository,
    @Inject(IProductsRepository)
    private readonly productsRepo: IProductsRepository,
  ) {}

  async execute(params?: {
    languageCode?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<IHomepageSectionResponse[]> {
    const { languageCode = DEFAULT_LANGUAGE_CODE, userId, page = 1, limit = 10 } = params || {};
    const featuredCategories = await this.homepageSectionRepo.findAllEnabled({
      languageCode,
      isLoggedIn: !!userId,
      page,
      limit,
    });

    return Promise.all(
      featuredCategories.map(async (featuredCategory): Promise<IHomepageSectionResponse> => {
        let data: IHomepageSectionResponse['data'] = [];
        const category = featuredCategory.category;

        if (category?.slug) {
          data = await this.productsRepo.findMany({
            category_slug: category.slug,
            orderBy: { created_at: 'desc' },
            take: 12,
            languageCode,
            userId,
          });
        }

        return {
          section: {
            id: featuredCategory.id,
            type: EHomepageSectionType.PRODUCT_CAROUSEL,
            order: featuredCategory.order,
            is_enabled: featuredCategory.is_active,
            require_login: false,
            created_at: featuredCategory.created_at,
            updated_at: featuredCategory.updated_at,
            categories: category ? [category] : [],
            translations: category?.translations?.map((translation) => ({
              title: translation.name,
            })),
          },
          data,
        };
      }),
    );
  }
}
