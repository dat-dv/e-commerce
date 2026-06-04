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

  /**
   * Lấy danh sách các phần (sections) để hiển thị trên Trang chủ.
   *
   * Tối ưu hóa hiệu năng (Chống N+1 Query):
   * Mặc định, mỗi lần lấy danh sách sản phẩm của 1 section, Repository sẽ tự động
   * query thêm 1 lần nữa vào DB để kiểm tra xem user đã thả tim sản phẩm đó chưa.
   * Nếu trang chủ có 10 sections, DB sẽ phải gánh 20 queries liên tục.
   *
   * Chiến lược xử lý:
   * 1. Cố tình KHÔNG truyền `userId` vào `productsRepo.findMany` để ép Repository
   *    bỏ qua bước query trạng thái thả tim (is_favorited).
   * 2. Sau khi tất cả sections đã load xong, gom toàn bộ ID sản phẩm thành 1 mảng lớn (dùng Set lọc trùng).
   * 3. Gọi đúng 1 query duy nhất (Batch fetch) thông qua Repository bằng mệnh đề `IN`.
   * 4. Dùng Map/Set trên RAM để gắn lại cờ `is_favorited` cho từng sản phẩm.
   */
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

    // We do NOT pass userId to findMany here to avoid N queries for favorite status
    const sections = await Promise.all(
      featuredCategories.map(async (featuredCategory): Promise<IHomepageSectionResponse> => {
        let data: IHomepageSectionResponse['data'] = [];
        const category = featuredCategory.category;

        if (category?.slug) {
          data = await this.productsRepo.findMany({
            category_slug: category.slug,
            orderBy: { created_at: 'desc' },
            take: 12,
            languageCode,
            // userId is intentionally omitted to batch fetch later
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

    // Batch fetch favorite status to avoid N+1 queries
    if (userId) {
      const allProductIds = Array.from(new Set(sections.flatMap((s) => s.data.map((p) => p.id))));

      if (allProductIds.length > 0) {
        const favoriteIds = await this.productsRepo.getFavoriteProductIds(userId, allProductIds);
        const favoriteSet = new Set(favoriteIds);

        for (const section of sections) {
          for (const product of section.data) {
            product.is_favorited = favoriteSet.has(product.id);
          }
        }
      }
    } else {
      // Ensure it defaults to false if no user is logged in
      for (const section of sections) {
        for (const product of section.data) {
          product.is_favorited = false;
        }
      }
    }

    return sections;
  }
}
