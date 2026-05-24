import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IFlashSalesRepository } from './domain/entities/flash-sales.repository.interface';
import { FlashSalesRepository } from './domain/infrastructure/flash-sales.repository';
import { AddProductsToFlashSaleUseCase } from './domain/use-cases/add-products-to-flash-sale.use-case';
import { CreateFlashSaleUseCase } from './domain/use-cases/create-flash-sale.use-case';
import { CreateFlashSalesBatchUseCase } from './domain/use-cases/create-flash-sales-batch.use-case';
import { CreateTimeSlotUseCase } from './domain/use-cases/create-time-slot.use-case';
import { CreateTimeSlotsBatchUseCase } from './domain/use-cases/create-time-slots-batch.use-case';
import { GetAllFlashSalesUseCase } from './domain/use-cases/get-all-flash-sales.use-case';
import { GetAllTimeSlotsUseCase } from './domain/use-cases/get-all-time-slots.use-case';
import { FlashSalesController } from './flash-sales.controller';

@Module({
  imports: [AuthModule],
  controllers: [FlashSalesController],
  providers: [
    CreateFlashSaleUseCase,
    CreateFlashSalesBatchUseCase,
    AddProductsToFlashSaleUseCase,
    CreateTimeSlotUseCase,
    CreateTimeSlotsBatchUseCase,
    GetAllFlashSalesUseCase,
    GetAllTimeSlotsUseCase,
    {
      provide: IFlashSalesRepository,
      useClass: FlashSalesRepository,
    },
  ],
  exports: [
    CreateFlashSaleUseCase,
    CreateFlashSalesBatchUseCase,
    AddProductsToFlashSaleUseCase,
    CreateTimeSlotUseCase,
    CreateTimeSlotsBatchUseCase,
    GetAllFlashSalesUseCase,
    GetAllTimeSlotsUseCase,
    IFlashSalesRepository,
  ],
})
export class FlashSalesModule {}
