import { Injectable, Inject } from '@nestjs/common';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class UpdateProductCategoryUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
  ) {}

  async execute(id: string, data: { name?: string; slug?: string; description?: string }) {
    const result = await this.categoriesRepository.update(id, data);
    await this.cacheService.deleteByPattern(CacheKeys.productCategoryTreePattern()).catch(() => {});

    return result;
  }
}
