import { Injectable, Inject } from '@nestjs/common';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

import { CreateCategoryDto } from '../../dto/create-product-category.dto';

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject(IProductCategoriesRepository)
    private readonly categoriesRepository: IProductCategoriesRepository,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
  ) {}

  async execute(data: CreateCategoryDto) {
    const result = await this.categoriesRepository.create(data);
    await this.cacheService.deleteByPattern(CacheKeys.productCategoryTreePattern()).catch(() => {});

    return result;
  }
}
