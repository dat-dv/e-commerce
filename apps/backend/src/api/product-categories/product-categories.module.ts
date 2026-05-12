import { forwardRef, Module } from '@nestjs/common';
import { ProductCategoriesController } from './product-categories.controller';
import { CreateProductCategoryUseCase } from './domain/use-cases/create-category.use-case';
import { UpdateProductCategoryUseCase } from './domain/use-cases/update-product-category.use-case';
import { GetAllProductCategoriesUseCase } from './domain/use-cases/get-all-product-categories.use-case';
import { DeleteProductCategoryUseCase } from './domain/use-cases/delete-product-category.use-case';
import { IProductCategoriesRepository } from './domain/entities/product-categories.repository.interface';
import { ProductCategoriesRepository } from './domain/infrastructure/product-categories.repository';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ProductCategoriesController],
  providers: [
    CreateProductCategoryUseCase,
    UpdateProductCategoryUseCase,
    GetAllProductCategoriesUseCase,
    DeleteProductCategoryUseCase,
    {
      provide: IProductCategoriesRepository,
      useClass: ProductCategoriesRepository,
    },
  ],
  exports: [
    CreateProductCategoryUseCase,
    UpdateProductCategoryUseCase,
    GetAllProductCategoriesUseCase,
    DeleteProductCategoryUseCase,
    IProductCategoriesRepository,
  ],
})
export class ProductCategoriesModule {}
