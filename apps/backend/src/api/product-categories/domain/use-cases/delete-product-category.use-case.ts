import { Injectable, Inject } from '@nestjs/common';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class DeleteProductCategoryUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
  ) {}

  async execute(id: string) {
    const result = await this.categoriesRepository.delete(id);
    await this.cacheService.deleteByPattern(CacheKeys.productCategoryTreePattern()).catch(() => {});

    return result;
  }
}
