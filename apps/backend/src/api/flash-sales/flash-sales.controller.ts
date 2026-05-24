import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AddProductsToFlashSaleUseCase } from './domain/use-cases/add-products-to-flash-sale.use-case';
import { CreateFlashSaleUseCase } from './domain/use-cases/create-flash-sale.use-case';
import { CreateFlashSalesBatchUseCase } from './domain/use-cases/create-flash-sales-batch.use-case';
import { CreateTimeSlotUseCase } from './domain/use-cases/create-time-slot.use-case';
import { CreateTimeSlotsBatchUseCase } from './domain/use-cases/create-time-slots-batch.use-case';
import { AddProductsToFlashSaleDto } from './dto/add-products-to-flash-sale.dto';
import { CreateFlashSaleDto, CreateFlashSalesBatchDto } from './dto/create-flash-sale.dto';
import { CreateTimeSlotDto, CreateTimeSlotsBatchDto } from './dto/create-time-slot.dto';

@Controller('flash-sales')
@UseGuards(AuthGuard, PermissionsGuard)
export class FlashSalesController {
  constructor(
    private readonly createFlashSaleUseCase: CreateFlashSaleUseCase,
    private readonly createFlashSalesBatchUseCase: CreateFlashSalesBatchUseCase,
    private readonly addProductsToFlashSaleUseCase: AddProductsToFlashSaleUseCase,
    private readonly createTimeSlotUseCase: CreateTimeSlotUseCase,
    private readonly createTimeSlotsBatchUseCase: CreateTimeSlotsBatchUseCase,
  ) {}

  @Post()
  @Permissions('CREATE:FLASH_SALE')
  async create(@Body() createFlashSaleDto: CreateFlashSaleDto) {
    const res = await this.createFlashSaleUseCase.execute(createFlashSaleDto);
    return createSuccessResponse(res);
  }

  @Post('batch')
  @Permissions('CREATE:FLASH_SALE')
  async createBatch(@Body() createFlashSalesBatchDto: CreateFlashSalesBatchDto) {
    const res = await this.createFlashSalesBatchUseCase.execute(createFlashSalesBatchDto);
    return createSuccessResponse(res);
  }

  @Post(':id/products')
  @Permissions('CREATE:FLASH_SALE')
  async addProducts(@Param('id') id: string, @Body() addProductsToFlashSaleDto: AddProductsToFlashSaleDto) {
    const res = await this.addProductsToFlashSaleUseCase.execute(id, addProductsToFlashSaleDto);
    return createSuccessResponse(res);
  }

  @Post('time-slots')
  @Permissions('CREATE:FLASH_SALE')
  async createTimeSlot(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    const res = await this.createTimeSlotUseCase.execute(createTimeSlotDto);
    return createSuccessResponse(res);
  }

  @Post('time-slots/batch')
  @Permissions('CREATE:FLASH_SALE')
  async createTimeSlotsBatch(@Body() createTimeSlotsBatchDto: CreateTimeSlotsBatchDto) {
    const res = await this.createTimeSlotsBatchUseCase.execute(createTimeSlotsBatchDto);
    return createSuccessResponse(res);
  }
}
