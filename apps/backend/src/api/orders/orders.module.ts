import { forwardRef, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from './domain/use-cases/create-order.use-case';
import { GetOrderUseCase } from './domain/use-cases/get-order.use-case';
import { GetUserOrdersUseCase } from './domain/use-cases/get-user-orders.use-case';
import { GetAllOrdersUseCase } from './domain/use-cases/get-all-orders.use-case';
import { UpdateOrderStatusUseCase } from './domain/use-cases/update-order-status.use-case';
import { CancelOrderUseCase } from './domain/use-cases/cancel-order.use-case';
import { IOrdersRepository } from './domain/entities/orders.repository.interface';
import { OrdersRepository } from './domain/infrastructure/orders.repository';
import { AuthModule } from 'src/api/auth/auth.module';
import { CartModule } from 'src/api/cart/cart.module';

@Module({
  imports: [forwardRef(() => AuthModule), CartModule],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    GetOrderUseCase,
    GetUserOrdersUseCase,
    GetAllOrdersUseCase,
    UpdateOrderStatusUseCase,
    CancelOrderUseCase,
    {
      provide: IOrdersRepository,
      useClass: OrdersRepository,
    },
  ],
  exports: [
    CreateOrderUseCase,
    GetOrderUseCase,
    GetUserOrdersUseCase,
    GetAllOrdersUseCase,
    UpdateOrderStatusUseCase,
    CancelOrderUseCase,
    IOrdersRepository,
  ],
})
export class OrdersModule {}
