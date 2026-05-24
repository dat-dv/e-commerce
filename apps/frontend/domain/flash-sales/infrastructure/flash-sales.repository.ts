import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import type { FlashSaleTimeSlot, IFlashSale } from "@ecommerce/shared";
import type { TFlashSale, TFlashSaleTimeSlot } from "../types/flash-sale.model";
import { FlashSalesMapper } from "./flash-sales.mapper";

export interface IFlashSalesRepository {
  getFlashSales(): Promise<ApiResponse<TFlashSale[]>>;
  getTimeSlots(): Promise<ApiResponse<TFlashSaleTimeSlot[]>>;
}

export class FlashSalesRepository implements IFlashSalesRepository {
  constructor(private request: TRequest) {}

  async getFlashSales(): Promise<ApiResponse<TFlashSale[]>> {
    const response = await this.request.get<IFlashSale[]>(
      API_ROUTES.FLASH_SALES.BASE,
    );

    return {
      ...response,
      data: response.data?.map(FlashSalesMapper.toDomain) || [],
    };
  }

  async getTimeSlots(): Promise<ApiResponse<TFlashSaleTimeSlot[]>> {
    const response = await this.request.get<FlashSaleTimeSlot[]>(
      API_ROUTES.FLASH_SALES.TIME_SLOTS,
    );

    return {
      ...response,
      data: response.data?.map(FlashSalesMapper.toTimeSlotDomain) || [],
    };
  }
}
