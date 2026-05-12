// src/api/homepage/domain/use-cases/get-homepage-sections.use-case.ts

import { Injectable, Inject } from '@nestjs/common';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { IHomepageSection, IHomepageSectionResponse, IHomepageProduct } from '../entities/homepage-section.entity';
import { IProductsRepository } from 'src/api/products/domain/entities/products.repository.interface';
import { IProduct } from 'src/api/products/domain/entities/product.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class GetHomepageSectionsUseCase {
  constructor(
    @Inject(IHomepageSectionRepository)
    private readonly homepageSectionRepo: IHomepageSectionRepository,
    @Inject(IProductsRepository)
    private readonly productsRepo: IProductsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(languageCode = 'vi'): Promise<IHomepageSectionResponse[]> {
    const sections = await this.homepageSectionRepo.findAllEnabled();

    const results = await Promise.all(
      sections.map(async (section): Promise<IHomepageSectionResponse> => {
        let products: any[] = [];

        if (section.type === 'flash_sale') {
          const flashSale = await this.productsRepo.getActiveFlashSale();
          products =
            flashSale?.products?.map(
              (p): IHomepageProduct => ({
                ...p.sku.product,
                skus: [
                  {
                    ...p.sku,
                    sale_price: p.sale_price,
                    sold: p.sold_count,
                    total: p.stock,
                  },
                ],
              }),
            ) || [];
        } else if (section.type === 'product_carousel') {
          const categorySlug = section.params?.category_slug;
          products = await this.productsRepo.findMany({
            category_slug: categorySlug,
            orderBy: { created_at: 'desc' },
            take: 12,
            languageCode,
          });
        }

        return {
          category: {
            id: section.id,
            title: section.title,
            type: section.type,
            slug: section.params?.category_slug,
            params: section.params,
          },
          data: products,
        };
      }),
    );

    return results;
  }
}
