import type {
  FlashSaleTimeSlot,
  IAddProductsToFlashSaleRequest,
  ICreateFlashSaleProductRequest,
  ICreateFlashSaleRequest,
  ICreateTimeSlotRequest,
  IFlashSale,
  IFlashSaleProduct,
} from "@ecommerce/shared";
import type {
  TAddProductsToFlashSaleInput,
  TCreateFlashSaleInput,
  TCreateFlashSaleProductInput,
  TCreateTimeSlotInput,
  TFlashSale,
  TFlashSaleProduct,
  TFlashSaleTimeSlot,
} from "../types/flash-sale.model";

export class FlashSalesMapper {
  static toDomain(dto: IFlashSale): TFlashSale {
    return {
      id: dto.id,
      name: dto.name,
      startTime: new Date(dto.start_time).toISOString(),
      endTime: new Date(dto.end_time).toISOString(),
      createdAt: new Date(dto.created_at).toISOString(),
      updatedAt: new Date(dto.updated_at).toISOString(),
      timeSlotId: dto.time_slot_id,
      timeSlot: dto.time_slot
        ? FlashSalesMapper.toTimeSlotDomain(dto.time_slot)
        : null,
      products: dto.products.map(FlashSalesMapper.toProductDomain),
    };
  }

  static toProductDomain(dto: IFlashSaleProduct): TFlashSaleProduct {
    return {
      id: dto.id,
      flashSaleId: dto.flash_sale_id,
      skuId: dto.sku_id,
      skuCode: dto.sku?.sku_code,
      salePrice: Number(dto.sale_price),
      stock: dto.stock,
      soldCount: dto.sold_count,
      orderLimit: dto.order_limit,
    };
  }

  static toTimeSlotDomain(dto: FlashSaleTimeSlot): TFlashSaleTimeSlot {
    return {
      id: dto.id,
      name: dto.name,
      startHour: dto.start_hour,
      startMinute: dto.start_minute,
      endHour: dto.end_hour,
      endMinute: dto.end_minute,
      isActive: dto.is_active,
    };
  }

  static toCreateTimeSlotDTO(
    input: TCreateTimeSlotInput,
  ): ICreateTimeSlotRequest {
    return {
      name: input.name,
      start_hour: input.startHour,
      start_minute: input.startMinute,
      end_hour: input.endHour,
      end_minute: input.endMinute,
      is_active: input.isActive,
    };
  }

  static toCreateFlashSaleProductDTO(
    input: TCreateFlashSaleProductInput,
  ): ICreateFlashSaleProductRequest {
    return {
      sku_id: input.skuId,
      sale_price: input.salePrice,
      stock: input.stock,
      order_limit: input.orderLimit,
    };
  }

  static toCreateFlashSaleDTO(
    input: TCreateFlashSaleInput,
  ): ICreateFlashSaleRequest {
    return {
      name: input.name,
      start_time: input.startTime,
      end_time: input.endTime,
      time_slot_id: input.timeSlotId,
      products: input.products.map(
        FlashSalesMapper.toCreateFlashSaleProductDTO,
      ),
    };
  }

  static toAddProductsToFlashSaleDTO(
    input: TAddProductsToFlashSaleInput,
  ): IAddProductsToFlashSaleRequest {
    return {
      products: input.products.map(
        FlashSalesMapper.toCreateFlashSaleProductDTO,
      ),
    };
  }
}
