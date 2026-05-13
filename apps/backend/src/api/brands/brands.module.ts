import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { GetTopBrandsUseCase } from './domain/use-cases/get-top-brands.use-case';
import { GetBrandBySlugUseCase } from './domain/use-cases/get-brand-by-slug.use-case';
import { GetBrandProductsUseCase } from './domain/use-cases/get-brand-products.use-case';
import { IBrandsRepository } from './domain/entities/brands.repository.interface';
import { BrandsRepository } from './domain/infrastructure/brands.repository';

@Module({
  controllers: [BrandsController],
  providers: [
    GetTopBrandsUseCase,
    GetBrandBySlugUseCase,
    GetBrandProductsUseCase,
    {
      provide: IBrandsRepository,
      useClass: BrandsRepository,
    },
  ],
  exports: [GetTopBrandsUseCase, GetBrandBySlugUseCase, GetBrandProductsUseCase, IBrandsRepository],
})
export class BrandsModule {}
