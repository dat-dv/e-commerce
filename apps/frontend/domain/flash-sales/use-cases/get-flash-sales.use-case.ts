import { IFlashSalesRepository } from "../infrastructure/flash-sales.repository";
import type {
  TAddProductsToFlashSaleInput,
  TCreateFlashSaleInput,
  TCreateTimeSlotInput,
} from "../types/flash-sale.model";

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

export class CreateFlashSaleUseCase {
  constructor(private flashSalesRepository: IFlashSalesRepository) {}

  async execute(input: TCreateFlashSaleInput) {
    return this.flashSalesRepository.createFlashSale(input);
  }
}

export class AddProductsToFlashSaleUseCase {
  constructor(private flashSalesRepository: IFlashSalesRepository) {}

  async execute(id: string, input: TAddProductsToFlashSaleInput) {
    return this.flashSalesRepository.addProductsToFlashSale(id, input);
  }
}
