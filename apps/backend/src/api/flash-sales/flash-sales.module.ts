import { Module } from '@nestjs/common';
import { FlashSalesController } from './flash-sales.controller';
import { IFlashSalesRepository } from './domain/entities/flash-sales.repository.interface';
import { FlashSalesRepository } from './domain/infrastructure/flash-sales.repository';
import { CreateFlashSaleUseCase } from './domain/use-cases/create-flash-sale.use-case';

@Module({
  controllers: [FlashSalesController],
  providers: [
    CreateFlashSaleUseCase,
    {
      provide: IFlashSalesRepository,
      useClass: FlashSalesRepository,
    },
  ],
  exports: [CreateFlashSaleUseCase, IFlashSalesRepository],
})
export class FlashSalesModule {}
