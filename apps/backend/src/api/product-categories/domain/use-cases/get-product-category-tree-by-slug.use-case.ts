import { ICategoryResponse } from '@ecommerce/shared';
import { Injectable, Inject } from '@nestjs/common';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

const CATEGORY_TREE_CACHE_TTL_SECONDS = 6 * 60 * 60;

@Injectable()
export class GetProductCategoryTreeBySlugUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
  ) {}

  async execute(languageCode: string = 'vi', slug: string) {
    const cacheKey = CacheKeys.productCategoryTreeBySlug(languageCode, slug);
    const cached = await this.cacheService.get(cacheKey).catch(() => null);

    if (cached) {
      try {
        return JSON.parse(cached) as ICategoryResponse | null;
      } catch {
        await this.cacheService.delete(cacheKey).catch(() => {});
      }
    }

    const result = await this.categoriesRepository.findTreeBySlug(slug, languageCode);
    await this.cacheService.set(cacheKey, JSON.stringify(result), CATEGORY_TREE_CACHE_TTL_SECONDS).catch(() => {});

    return result;
  }
}
