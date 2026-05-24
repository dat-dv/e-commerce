import { IFlashSalesRepository } from "../infrastructure/flash-sales.repository";

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
