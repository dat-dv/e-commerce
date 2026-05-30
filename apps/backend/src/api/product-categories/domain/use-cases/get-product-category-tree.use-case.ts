import { ICategoryResponse } from '@ecommerce/shared';
import { Inject, Injectable } from '@nestjs/common';

import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

const CATEGORY_TREE_CACHE_TTL_SECONDS = 6 * 60 * 60;

@Injectable()
export class GetProductCategoryTreeUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoryRepository: IProductCategoriesRepository,

    @Inject(ICacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async execute(languageCode = 'vi'): Promise<ICategoryResponse[]> {
    const cacheKey = CacheKeys.productCategoryTree(languageCode);

    const cached = await this.cacheService.get(cacheKey).catch(() => null);

    if (cached) {
      try {
        return JSON.parse(cached) as ICategoryResponse[];
      } catch {
        await this.cacheService.delete(cacheKey).catch(() => undefined);
      }
    }

    const result = await this.categoryRepository.findTree(languageCode);

    await this.cacheService
      .set(cacheKey, JSON.stringify(result), CATEGORY_TREE_CACHE_TTL_SECONDS)
      .catch(() => undefined);

    return result;
  }
}
