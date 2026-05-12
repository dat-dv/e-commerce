import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { GetCartUseCase } from './domain/use-cases/get-cart.use-case';
import { AddToCartUseCase } from './domain/use-cases/add-to-cart.use-case';
import { UpdateCartItemUseCase } from './domain/use-cases/update-cart-item.use-case';
import { RemoveFromCartUseCase } from './domain/use-cases/remove-from-cart.use-case';
import { ICartRepository } from './domain/entities/cart.repository.interface';
import { CartRepository } from './domain/infrastructure/cart.repository';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CartController],
  providers: [
    GetCartUseCase,
    AddToCartUseCase,
    UpdateCartItemUseCase,
    RemoveFromCartUseCase,
    {
      provide: ICartRepository,
      useClass: CartRepository,
    },
  ],
  exports: [GetCartUseCase, AddToCartUseCase, UpdateCartItemUseCase, RemoveFromCartUseCase, ICartRepository],
})
export class CartModule {}
