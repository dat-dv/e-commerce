import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateFlashSaleUseCase } from './domain/use-cases/create-flash-sale.use-case';
import { CreateTimeSlotUseCase } from './domain/use-cases/create-time-slot.use-case';
import { CreateTimeSlotsBatchUseCase } from './domain/use-cases/create-time-slots-batch.use-case';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { CreateTimeSlotDto, CreateTimeSlotsBatchDto } from './dto/create-time-slot.dto';

@Controller('flash-sales')
@UseGuards(AuthGuard, PermissionsGuard)
export class FlashSalesController {
  constructor(
    private readonly createFlashSaleUseCase: CreateFlashSaleUseCase,
    private readonly createTimeSlotUseCase: CreateTimeSlotUseCase,
    private readonly createTimeSlotsBatchUseCase: CreateTimeSlotsBatchUseCase,
  ) {}

  @Post()
  @Permissions('CREATE:FLASH_SALE')
  async create(@Body() createFlashSaleDto: CreateFlashSaleDto) {
    const res = await this.createFlashSaleUseCase.execute(createFlashSaleDto);
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
