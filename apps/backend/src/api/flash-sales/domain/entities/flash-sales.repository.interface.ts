import type { FlashSaleTimeSlot, IFlashSale } from '@ecommerce/shared';
import { CreateFlashSaleDto, CreateFlashSalesBatchDto } from '../../dto/create-flash-sale.dto';
import { CreateTimeSlotDto, CreateTimeSlotsBatchDto } from '../../dto/create-time-slot.dto';

export interface IFlashSalesRepository {
  create(data: CreateFlashSaleDto): Promise<IFlashSale>;
  createFlashSalesBatch(data: CreateFlashSalesBatchDto): Promise<IFlashSale[]>;
  findTimeSlotById(id: string): Promise<FlashSaleTimeSlot | null>;
  createTimeSlot(data: CreateTimeSlotDto): Promise<FlashSaleTimeSlot>;
  createTimeSlotsBatch(data: CreateTimeSlotsBatchDto): Promise<{ count: number }>;
}

export const IFlashSalesRepository = Symbol('IFlashSalesRepository');
