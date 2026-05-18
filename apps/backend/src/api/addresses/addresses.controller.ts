import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateAddressUseCase } from './domain/use-cases/create-address.use-case';
import { GetAddressesUseCase } from './domain/use-cases/get-addresses.use-case';
import { UpdateAddressUseCase } from './domain/use-cases/update-address.use-case';
import { DeleteAddressUseCase } from './domain/use-cases/delete-address.use-case';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { IApiResponse, IAddressResponse } from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';
import type { Request } from 'express';

@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly getAddressesUseCase: GetAddressesUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateAddressDto): Promise<IApiResponse<IAddressResponse>> {
    const userId = req.user.sub;
    const result = await this.createAddressUseCase.execute(userId, dto);
    return createSuccessResponse(result);
  }

  @Get()
  async findAll(@Req() req: Request): Promise<IApiResponse<IAddressResponse[]>> {
    const userId = req.user.sub;
    const result = await this.getAddressesUseCase.execute(userId);
    return createSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateAddressDto,
  ): Promise<IApiResponse<IAddressResponse>> {
    const userId = req.user.sub;
    const result = await this.updateAddressUseCase.execute(id, userId, dto);
    return createSuccessResponse(result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request): Promise<IApiResponse<boolean>> {
    const userId = req.user.sub;
    await this.deleteAddressUseCase.execute(id, userId);
    return createSuccessResponse(true);
  }
}
