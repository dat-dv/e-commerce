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
import { OrderReturnsModule } from './api/order-returns/order-returns.module';
import { AddressesModule } from './api/addresses/addresses.module';
import { NotificationsModule } from './api/notifications/notifications.module';
import { HomepageModule } from './api/homepage/homepage.module';
import { BrandsModule } from './api/brands/brands.module';
import { UserFavoriteProductsModule } from './api/user-favorite-products/user-favorite-products.module';
import { HelpContactSubmissionsModule } from './api/help-contact-submissions/help-contact-submissions.module';

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
    OrderReturnsModule,
    AddressesModule,
    NotificationsModule,
    HomepageModule,
    BrandsModule,
    UserFavoriteProductsModule,
    HelpContactSubmissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
