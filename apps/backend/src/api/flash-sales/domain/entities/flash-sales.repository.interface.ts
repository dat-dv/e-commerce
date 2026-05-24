import type { FlashSaleTimeSlot, IFlashSale } from '@ecommerce/shared';
import { AddProductsToFlashSaleDto } from '../../dto/add-products-to-flash-sale.dto';
import { CreateFlashSaleDto, CreateFlashSalesBatchDto } from '../../dto/create-flash-sale.dto';
import { CreateTimeSlotDto, CreateTimeSlotsBatchDto } from '../../dto/create-time-slot.dto';

export interface IFlashSalesRepository {
  create(data: CreateFlashSaleDto): Promise<IFlashSale>;
  createFlashSalesBatch(data: CreateFlashSalesBatchDto): Promise<IFlashSale[]>;
  findFlashSaleById(id: string): Promise<IFlashSale | null>;
  addProductsToFlashSale(flashSaleId: string, data: AddProductsToFlashSaleDto): Promise<IFlashSale>;
  findTimeSlotById(id: string): Promise<FlashSaleTimeSlot | null>;
  createTimeSlot(data: CreateTimeSlotDto): Promise<FlashSaleTimeSlot>;
  createTimeSlotsBatch(data: CreateTimeSlotsBatchDto): Promise<{ count: number }>;
}

export const IFlashSalesRepository = Symbol('IFlashSalesRepository');
