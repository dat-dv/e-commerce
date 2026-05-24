import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import type { FlashSaleTimeSlot, IFlashSale } from "@ecommerce/shared";
import type {
  TAddProductsToFlashSaleInput,
  TCreateFlashSaleInput,
  TCreateTimeSlotInput,
  TFlashSale,
  TFlashSaleTimeSlot,
} from "../types/flash-sale.model";
import { FlashSalesMapper } from "./flash-sales.mapper";

export interface IFlashSalesRepository {
  getFlashSales(): Promise<ApiResponse<TFlashSale[]>>;
  getTimeSlots(): Promise<ApiResponse<TFlashSaleTimeSlot[]>>;
  createTimeSlot(
    input: TCreateTimeSlotInput,
  ): Promise<ApiResponse<TFlashSaleTimeSlot>>;
  createFlashSale(
    input: TCreateFlashSaleInput,
  ): Promise<ApiResponse<TFlashSale>>;
  addProductsToFlashSale(
    id: string,
    input: TAddProductsToFlashSaleInput,
  ): Promise<ApiResponse<TFlashSale>>;
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

  async createTimeSlot(
    input: TCreateTimeSlotInput,
  ): Promise<ApiResponse<TFlashSaleTimeSlot>> {
    const response = await this.request.post<FlashSaleTimeSlot>(
      API_ROUTES.FLASH_SALES.TIME_SLOTS,
      FlashSalesMapper.toCreateTimeSlotDTO(input),
    );

    return {
      ...response,
      data: FlashSalesMapper.toTimeSlotDomain(response.data),
    };
  }

  async createFlashSale(
    input: TCreateFlashSaleInput,
  ): Promise<ApiResponse<TFlashSale>> {
    const response = await this.request.post<IFlashSale>(
      API_ROUTES.FLASH_SALES.BASE,
      FlashSalesMapper.toCreateFlashSaleDTO(input),
    );

    return {
      ...response,
      data: FlashSalesMapper.toDomain(response.data),
    };
  }

  async addProductsToFlashSale(
    id: string,
    input: TAddProductsToFlashSaleInput,
  ): Promise<ApiResponse<TFlashSale>> {
    const response = await this.request.post<IFlashSale>(
      API_ROUTES.FLASH_SALES.ADD_PRODUCTS(id),
      FlashSalesMapper.toAddProductsToFlashSaleDTO(input),
    );

    return {
      ...response,
      data: FlashSalesMapper.toDomain(response.data),
    };
  }
}
