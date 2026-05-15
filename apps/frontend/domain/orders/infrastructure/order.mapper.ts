import { IOrder, IOrderItem } from "../types/order.model";
import {
  IOrder as IOrderDTO,
  IOrderItem as IOrderItemDTO,
  IOrderItemSnapshot,
} from "@ecommerce/shared";

/** Re-exported so dependants can import `IOrderDTO` from this file without depending on @ecommerce/shared directly. */
export type { IOrderDTO };

export class OrderMapper {
  static toDomain(dto: IOrderDTO): IOrder {
    return {
      id: dto.id,
      status: dto.status,
      totalAmount: dto.total_amount,
      discountAmount: dto.discount_amount,
      items:
        dto.items?.map((item) => OrderMapper.toOrderItemDomain(item)) || [],
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toOrderItemDomain(dto: IOrderItemDTO): IOrderItem {
    // snapshot carries point-in-time data captured at purchase — always prefer over live relation
    const snap = dto.snapshot as IOrderItemSnapshot | null | undefined;
    const skuSnap = snap?.sku;

    return {
      id: dto.id,
      skuId: dto.sku_id,
      quantity: dto.quantity,
      price: dto.price,
      originalPrice: skuSnap?.original_price ?? undefined,
      attributes: skuSnap?.attributes ?? undefined,
      flashSaleId: dto.flash_sale_id ?? undefined,
      sku: skuSnap
        ? {
            id: skuSnap.id,
            skuCode: skuSnap.sku_code,
            imageUrl:
              skuSnap.image_url || skuSnap.product?.thumbnail_url || undefined,
            product: skuSnap.product
              ? {
                  id: skuSnap.product.id,
                  slug: skuSnap.product.slug,
                  name: skuSnap.product.name,
                  thumbnailUrl: skuSnap.product.thumbnail_url ?? undefined,
                  basePrice: skuSnap.product.base_price,
                  rating: skuSnap.product.rating,
                }
              : undefined,
          }
        : undefined,
    };
  }
}
