import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { GetRecommendationsUseCase } from './domain/use-cases/get-recommendations.use-case';
import { GetFlashSaleUseCase } from './domain/use-cases/get-flash-sale.use-case';
import { IProductsRepository } from './domain/entities/products.repository.interface';
import { ProductsRepository } from './domain/infrastructure/products.repository';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ProductsController],
  providers: [
    GetRecommendationsUseCase,
    GetFlashSaleUseCase,
    {
      provide: IProductsRepository,
      useClass: ProductsRepository,
    },
  ],
  exports: [GetRecommendationsUseCase, GetFlashSaleUseCase, IProductsRepository],
})
export class ProductsModule {}
