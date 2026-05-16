import { Module } from '@nestjs/common';
import { UserFavoriteProductsController } from './user-favorite-products.controller';
import { UserFavoriteProductsService } from './user-favorite-products.service';
import { UserFavoriteProductsRepository } from './domain/infrastructure/user-favorite-products.repository';
import { IUserFavoriteProductsRepository } from './domain/entities/user-favorite-products.repository.interface';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserFavoriteProductsController],
  providers: [
    UserFavoriteProductsService,
    {
      provide: IUserFavoriteProductsRepository,
      useClass: UserFavoriteProductsRepository,
    },
  ],
  exports: [UserFavoriteProductsService, IUserFavoriteProductsRepository],
})
export class UserFavoriteProductsModule {}
