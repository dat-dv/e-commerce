import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { GetRecommendedUseCase } from './domain/use-cases/get-recommended.use-case';
import { GetInterestBasedUseCase } from './domain/use-cases/get-interest-based.use-case';
import { GetRecentlyViewedUseCase } from './domain/use-cases/get-recently-viewed.use-case';
import { GetFlashSaleUseCase } from './domain/use-cases/get-flash-sale.use-case';
import { GetProductsUseCase } from './domain/use-cases/get-products.use-case';
import { GetProductDetailUseCase } from './domain/use-cases/get-product-detail.use-case';
import { GetProductReviewsUseCase } from './domain/use-cases/get-product-reviews.use-case';
import { GetSimilarProductsUseCase } from './domain/use-cases/get-similar-products.use-case';
import { IProductsRepository } from './domain/entities/products.repository.interface';
import { ProductsRepository } from './domain/infrastructure/products.repository';

@Module({
  imports: [forwardRef(() => AuthModule), SharedModule],
  controllers: [ProductsController],
  providers: [
    GetRecommendedUseCase,
    GetInterestBasedUseCase,
    GetRecentlyViewedUseCase,
    GetFlashSaleUseCase,
    GetProductsUseCase,
    GetProductDetailUseCase,
    GetProductReviewsUseCase,
    GetSimilarProductsUseCase,
    {
      provide: IProductsRepository,
      useClass: ProductsRepository,
    },
  ],
  exports: [
    GetRecommendedUseCase,
    GetInterestBasedUseCase,
    GetRecentlyViewedUseCase,
    GetFlashSaleUseCase,
    GetProductsUseCase,
    GetProductDetailUseCase,
    GetProductReviewsUseCase,
    GetSimilarProductsUseCase,
    IProductsRepository,
  ],
})
export class ProductsModule {}
