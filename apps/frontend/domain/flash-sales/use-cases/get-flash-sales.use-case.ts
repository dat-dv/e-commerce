import { IFlashSalesRepository } from "../infrastructure/flash-sales.repository";
import type { TCreateTimeSlotInput } from "../types/flash-sale.model";

export class GetFlashSalesUseCase {
  constructor(private flashSalesRepository: IFlashSalesRepository) {}

  async execute() {
    return this.flashSalesRepository.getFlashSales();
  }
}

export class GetFlashSaleTimeSlotsUseCase {
  constructor(private flashSalesRepository: IFlashSalesRepository) {}

  async execute() {
    return this.flashSalesRepository.getTimeSlots();
  }
}

export class CreateFlashSaleTimeSlotUseCase {
  constructor(private flashSalesRepository: IFlashSalesRepository) {}

  async execute(input: TCreateTimeSlotInput) {
    return this.flashSalesRepository.createTimeSlot(input);
  }
}
