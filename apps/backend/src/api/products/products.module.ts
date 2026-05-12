import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CategoriesController } from './categories.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { GetRecommendedUseCase } from './domain/use-cases/get-recommended.use-case';
import { GetInterestBasedUseCase } from './domain/use-cases/get-interest-based.use-case';
import { GetRecentlyViewedUseCase } from './domain/use-cases/get-recently-viewed.use-case';
import { GetFlashSaleUseCase } from './domain/use-cases/get-flash-sale.use-case';
import { GetProductsUseCase } from './domain/use-cases/get-products.use-case';
import { CreateCategoryUseCase } from './domain/use-cases/create-category.use-case';
import { IProductsRepository } from './domain/entities/products.repository.interface';
import { ProductsRepository } from './domain/infrastructure/products.repository';
import { ICategoriesRepository } from './domain/entities/categories.repository.interface';
import { CategoriesRepository } from './domain/infrastructure/categories.repository';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ProductsController, CategoriesController],
  providers: [
    GetRecommendedUseCase,
    GetInterestBasedUseCase,
    GetRecentlyViewedUseCase,
    GetFlashSaleUseCase,
    GetProductsUseCase,
    CreateCategoryUseCase,
    {
      provide: IProductsRepository,
      useClass: ProductsRepository,
    },
    {
      provide: ICategoriesRepository,
      useClass: CategoriesRepository,
    },
  ],
  exports: [
    GetRecommendedUseCase,
    GetInterestBasedUseCase,
    GetRecentlyViewedUseCase,
    GetFlashSaleUseCase,
    GetProductsUseCase,
    CreateCategoryUseCase,
    IProductsRepository,
    ICategoriesRepository,
  ],
})
export class ProductsModule {}
