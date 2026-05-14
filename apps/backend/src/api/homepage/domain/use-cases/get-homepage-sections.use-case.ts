// src/api/homepage/domain/use-cases/get-homepage-sections.use-case.ts

import { Injectable, Inject } from '@nestjs/common';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { EHomepageSectionType, IHomepageSectionResponse, IProduct, IBrand } from '@ecommerce/shared';
import { IProductsRepository } from 'src/api/products/domain/entities/products.repository.interface';
import { IBrandsRepository } from 'src/api/brands/domain/entities/brands.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class GetHomepageSectionsUseCase {
  constructor(
    @Inject(IHomepageSectionRepository)
    private readonly homepageSectionRepo: IHomepageSectionRepository,
    @Inject(IProductsRepository)
    private readonly productsRepo: IProductsRepository,
    @Inject(IBrandsRepository)
    private readonly brandsRepo: IBrandsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(languageCode = 'en', userId?: string): Promise<IHomepageSectionResponse[]> {
    const isLoggedIn = !!userId;
    const sections = await this.homepageSectionRepo.findAllEnabled(isLoggedIn);

    const results = await Promise.all(
      sections.map(async (section): Promise<IHomepageSectionResponse> => {
        let products: IProduct[] = [];
        let brands: IBrand[] | undefined;

        if (section.type === EHomepageSectionType.FLASH_SALE) {
          const flashSale = await this.productsRepo.getActiveFlashSale(languageCode);
          const flashSaleProducts = flashSale?.products || [];

          products = flashSaleProducts.reduce((acc: IProduct[], p) => {
            const product = p.sku?.product;
            if (product) {
              acc.push({
                ...product,
                skus: (product.skus || []).map((sku) => (sku.id === p.sku_id ? { ...sku, flash_sales: [p] } : sku)),
              });
            }
            return acc;
          }, []);
        } else if (section.type === EHomepageSectionType.PRODUCT_CAROUSEL) {
          const categorySlug = section.categories?.[0]?.slug;
          if (categorySlug) {
            products = await this.productsRepo.findMany({
              category_slug: categorySlug,
              orderBy: { created_at: 'desc' },
              take: 12,
              languageCode,
            });
          }
        } else if (section.type === EHomepageSectionType.RECOMMENDS) {
          if (userId) {
            const favCats = await this.prisma.userFavoriteCategory.findMany({
              where: { user_id: userId },
              orderBy: { score: 'desc' },
              take: 1,
            });
            if (favCats.length > 0) {
              products = await this.productsRepo.findMany({
                category_id: favCats[0].category_id,
                orderBy: { created_at: 'desc' },
                take: 12,
                languageCode,
              });
            }
          }
        } else if (section.type === EHomepageSectionType.RECENT_VIEW) {
          if (userId) {
            products = await this.productsRepo.getRecentlyViewed(userId, 12, languageCode);
          }
        } else if (section.type === EHomepageSectionType.NEW_ARRIVALS) {
          products = await this.productsRepo.getNewArrivals(12, languageCode);
        } else if (section.type === EHomepageSectionType.SUPER_DEALS) {
          products = await this.productsRepo.getSuperDeals(12, languageCode);
        }
        const translation =
          section.translations?.find((t) => t.language?.code === languageCode) || section.translations?.[0];
        const title = translation?.title || '';

        return {
          section: {
            id: section.id,
            title: title,
            type: section.type,
            categories: section.categories,
          },
          data: products,
          brands,
        };
      }),
    );

    return results;
  }
}
