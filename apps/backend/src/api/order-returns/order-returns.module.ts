import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { OrderReturnsController } from './order-returns.controller';
import { IOrderReturnsRepository } from './domain/entities/order-returns.repository.interface';
import { OrderReturnsRepository } from './domain/infrastructure/order-returns.repository';
import { CancelOrderReturnUseCase } from './domain/use-cases/cancel-order-return.use-case';
import { CreateOrderReturnUseCase } from './domain/use-cases/create-order-return.use-case';
import { GetOrderReturnsUseCase } from './domain/use-cases/get-order-returns.use-case';
import { UpdateOrderReturnStatusUseCase } from './domain/use-cases/update-order-return-status.use-case';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [OrderReturnsController],
  providers: [
    CancelOrderReturnUseCase,
    CreateOrderReturnUseCase,
    GetOrderReturnsUseCase,
    UpdateOrderReturnStatusUseCase,
    {
      provide: IOrderReturnsRepository,
      useClass: OrderReturnsRepository,
    },
  ],
  exports: [
    CancelOrderReturnUseCase,
    CreateOrderReturnUseCase,
    GetOrderReturnsUseCase,
    UpdateOrderReturnStatusUseCase,
    IOrderReturnsRepository,
  ],
})
export class OrderReturnsModule {}
