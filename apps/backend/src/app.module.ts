import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { RolesModule } from './api/roles/roles.module';
import { PermissionsModule } from './api/permissions/permissions.module';
import ConfigModule from './config/config.module';
import { UploadModule } from './api/upload/upload.module';
import { ProductsModule } from './api/products/products.module';
import { ProductCategoriesModule } from './api/product-categories/product-categories.module';
import { ReviewsModule } from './api/reviews/reviews.module';
import { CartModule } from './api/cart/cart.module';
import { OrdersModule } from './api/orders/orders.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    UploadModule,
    ProductsModule,
    ProductCategoriesModule,
    ReviewsModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
