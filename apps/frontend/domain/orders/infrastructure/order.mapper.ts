import { TOrder, TOrderItem, TShippingAddress } from "../types/order.model";
import {
  IOrderResponse,
  IOrderItemResponse,
  IOrderItemSnapshot,
  ShippingAddress as ShippingAddressDTO,
} from "@ecommerce/shared";

export class OrderMapper {
  static toDomain(dto: IOrderResponse): TOrder {
    return {
      id: dto.id,
      userId: dto.user_id,
      status: dto.status,
      totalAmount: dto.total_amount,
      discountAmount: dto.discount_amount,
      shippingAddressId: dto.shipping_address_id,
      couponId: dto.coupon_id,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updatedAt: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
      items:
        dto.items?.map((item) => OrderMapper.toOrderItemDomain(item)) || [],
      shippingAddress: dto.shipping_address
        ? OrderMapper.toShippingAddressDomain(dto.shipping_address)
        : null,
      user: dto.user
        ? {
            id: dto.user.id,
            email: dto.user.email,
            firstName: dto.user.first_name,
            lastName: dto.user.last_name,
          }
        : null,
    };
  }

  static toOrderItemDomain(dto: IOrderItemResponse): TOrderItem {
    const snapshot = (dto.snapshot as object as IOrderItemSnapshot) || null;
    const skuSnap = snapshot?.sku;

    return {
      id: dto.id,
      skuId: dto.sku_id,
      quantity: dto.quantity,
      price: dto.price,
      flashSaleId: dto.flash_sale_id,
      snapshot,
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

  static toShippingAddressDomain(dto: ShippingAddressDTO): TShippingAddress {
    return {
      id: dto.id,
      receiverName: dto.receiver_name,
      receiverPhone: dto.receiver_phone,
      label: dto.label,
      latitude: dto.latitude,
      longitude: dto.longitude,
      street: dto.street,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      postalCode: dto.postal_code,
      isDefault: dto.is_default,
      userId: dto.user_id,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updatedAt: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
    };
  }
}
