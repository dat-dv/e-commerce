import { Injectable, Inject } from '@nestjs/common';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { EHomepageSectionType, IHomepageSectionResponse } from '@ecommerce/shared';
import { IProductsRepository } from 'src/api/products/domain/entities/products.repository.interface';

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
    const { languageCode = 'en', userId, page = 1, limit = 10 } = params || {};
    const isLoggedIn = !!userId;
    const sections = await this.homepageSectionRepo.findAllEnabled({
      languageCode,
      isLoggedIn,
      page,
      limit,
    });

    return Promise.all(
      sections.map(async (section): Promise<IHomepageSectionResponse> => {
        let data: IHomepageSectionResponse['data'] = [];
        const type = section.type as EHomepageSectionType;
        if (type === EHomepageSectionType.PRODUCT_CAROUSEL) {
          const categorySlug = section.categories?.[0]?.slug;
          if (categorySlug) {
            data = await this.productsRepo.findMany({
              category_slug: categorySlug,
              orderBy: { created_at: 'desc' },
              take: 12,
              languageCode,
              userId,
            });
          }
        }

        return {
          section,
          data,
        };
      }),
    );
  }
}
