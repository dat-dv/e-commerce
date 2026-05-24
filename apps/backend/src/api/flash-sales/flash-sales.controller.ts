import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateFlashSaleUseCase } from './domain/use-cases/create-flash-sale.use-case';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';

@Controller('flash-sales')
@UseGuards(AuthGuard, PermissionsGuard)
export class FlashSalesController {
  constructor(private readonly createFlashSaleUseCase: CreateFlashSaleUseCase) {}

  @Post()
  @Permissions('CREATE:FLASH_SALE')
  async create(@Body() createFlashSaleDto: CreateFlashSaleDto) {
    const res = await this.createFlashSaleUseCase.execute(createFlashSaleDto);
    return createSuccessResponse(res);
  }
}
