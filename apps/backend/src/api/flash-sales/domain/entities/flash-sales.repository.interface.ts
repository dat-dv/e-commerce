import type { FlashSaleTimeSlot, IFlashSale } from '@ecommerce/shared';
import { CreateFlashSaleDto } from '../../dto/create-flash-sale.dto';

export interface IFlashSalesRepository {
  create(data: CreateFlashSaleDto): Promise<IFlashSale>;

  findTimeSlotById(id: string): Promise<FlashSaleTimeSlot | null>;
}

export const IFlashSalesRepository = Symbol('IFlashSalesRepository');
