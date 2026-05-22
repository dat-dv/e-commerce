import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { IBrandsRepository } from './domain/entities/brands.repository.interface';
import { BrandsRepository } from './domain/infrastructure/brands.repository';
import { GetBrandBySlugUseCase } from './domain/use-cases/get-brand-by-slug.use-case';
import { GetBrandCategoryTreeUseCase } from './domain/use-cases/get-brand-category-tree.use-case';
import { GetBrandProductsUseCase } from './domain/use-cases/get-brand-products.use-case';
import { GetBrandListUseCase } from './domain/use-cases/get-top-brands.use-case';

@Module({
  controllers: [BrandsController],
  providers: [
    GetBrandListUseCase,
    GetBrandBySlugUseCase,
    GetBrandProductsUseCase,
    GetBrandCategoryTreeUseCase,
    {
      provide: IBrandsRepository,
      useClass: BrandsRepository,
    },
  ],
  exports: [
    GetBrandListUseCase,
    GetBrandBySlugUseCase,
    GetBrandProductsUseCase,
    GetBrandCategoryTreeUseCase,
    IBrandsRepository,
  ],
})
export class BrandsModule {}
