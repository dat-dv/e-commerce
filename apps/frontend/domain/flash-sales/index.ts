import { appRequest } from "@/constants/app-request";
import { FlashSalesRepository } from "./infrastructure/flash-sales.repository";
import {
  CreateFlashSaleTimeSlotUseCase,
  GetFlashSalesUseCase,
  GetFlashSaleTimeSlotsUseCase,
} from "./use-cases/get-flash-sales.use-case";

const repo = new FlashSalesRepository(appRequest);

export const flashSalesUseCase = {
  getFlashSales: new GetFlashSalesUseCase(repo),
  getTimeSlots: new GetFlashSaleTimeSlotsUseCase(repo),
  createTimeSlot: new CreateFlashSaleTimeSlotUseCase(repo),
};
