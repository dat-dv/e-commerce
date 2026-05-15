import { Injectable, Inject } from '@nestjs/common';
import {
  IHomepageSectionRepository,
  HomepageSectionWithDetails,
} from '../entities/homepage-section.repository.interface';
import { EHomepageSectionType, IHomepageSectionResponse, Product, IHomepageSection, Brand } from '@ecommerce/shared';
import { IProductsRepository } from 'src/api/products/domain/entities/products.repository.interface';
import { IBrandsRepository } from 'src/api/brands/domain/entities/brands.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';

type ProductWithSkus = Prisma.ProductGetPayload<{
  include: { translations: true; skus: true };
}>;

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
        let data: Product[] = [];
        let brands: Brand[] | undefined;

        const sectionType = section.type as unknown as EHomepageSectionType;

        if (sectionType === EHomepageSectionType.FLASH_SALE) {
          const flashSale = await this.productsRepo.getActiveFlashSale(languageCode);
          if (flashSale) {
            // Nghiệp vụ: Lồng dữ liệu Flash Sale vào SKU của Product, gom nhóm theo product ID
            const productMap = new Map<string, ProductWithSkus>();
            for (const p of flashSale.products) {
              const prod = p.sku.product;
              if (!productMap.has(prod.id)) {
                productMap.set(prod.id, { ...prod, skus: [...prod.skus] });
              }
              const mappedProd = productMap.get(prod.id);
              if (mappedProd && mappedProd?.skus) {
                mappedProd.skus = mappedProd.skus.map((sku) =>
                  sku.id === p.sku_id ? { ...sku, flash_sales: [p] } : sku,
                );
              }
            }
            data = Array.from(productMap.values());
          }
        } else if (sectionType === EHomepageSectionType.PRODUCT_CAROUSEL) {
          const categorySlug = section.categories?.[0]?.slug;
          if (categorySlug) {
            data = await this.productsRepo.findMany({
              category_slug: categorySlug,
              orderBy: { created_at: 'desc' },
              take: 12,
              languageCode,
            });
          }
        } else if (sectionType === EHomepageSectionType.RECOMMENDS) {
          if (userId) {
            const favCats = await this.prisma.userFavoriteCategory.findMany({
              where: { user_id: userId },
              orderBy: { score: 'desc' },
              take: 1,
            });
            if (favCats.length > 0) {
              data = await this.productsRepo.findMany({
                category_id: favCats[0].category_id,
                orderBy: { created_at: 'desc' },
                take: 12,
                languageCode,
              });
            }
          }
        } else if (sectionType === EHomepageSectionType.RECENT_VIEW) {
          if (userId) {
            data = await this.productsRepo.getRecentlyViewed(userId, 12, languageCode);
          }
        }

        return {
          section,
          data,
          brands,
        };
      }),
    );

    return results;
  }
}
