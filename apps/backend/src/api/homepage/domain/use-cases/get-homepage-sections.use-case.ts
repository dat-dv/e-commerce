import { Injectable, Inject } from '@nestjs/common';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { EHomepageSectionType, IHomepageSectionResponse, IProductResponse } from '@ecommerce/shared';
import { IProductsRepository } from 'src/api/products/domain/entities/products.repository.interface';

@Injectable()
export class GetHomepageSectionsUseCase {
  constructor(
    @Inject(IHomepageSectionRepository)
    private readonly homepageSectionRepo: IHomepageSectionRepository,
    @Inject(IProductsRepository)
    private readonly productsRepo: IProductsRepository,
  ) {}

  async execute(languageCode = 'en', userId?: string): Promise<IHomepageSectionResponse[]> {
    const isLoggedIn = !!userId;
    const sections = await this.homepageSectionRepo.findAllEnabled(languageCode, isLoggedIn);
    const supportedSectionTypes = new Set<string>([
      EHomepageSectionType.FLASH_SALE,
      EHomepageSectionType.PRODUCT_CAROUSEL,
    ]);

    const results = await Promise.all(
      sections
        .filter((section) => supportedSectionTypes.has(section.type))
        .map(async (section): Promise<IHomepageSectionResponse> => {
          let data: IProductResponse[] = [];

          const sectionType = section.type as EHomepageSectionType;

          if (sectionType === EHomepageSectionType.FLASH_SALE) {
            const flashSale = await this.productsRepo.getActiveFlashSale(languageCode, userId);
            if (flashSale) {
              // Nghiệp vụ: Lồng dữ liệu Flash Sale vào SKU của Product, gom nhóm theo product ID
              const productMap = new Map<string, IProductResponse>();
              for (const p of flashSale.products) {
                const prod = p.sku.product;
                if (!productMap.has(prod.id)) {
                  productMap.set(prod.id, {
                    ...prod,
                    skus: [...(prod.skus || [])],
                    translations: [...(prod.translations || [])],
                  });
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
            const categorySlug = section?.categories?.[0]?.slug;
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

    return results;
  }
}
