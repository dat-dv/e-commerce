import { EOrderStatus, IOrderItemSnapshot } from "@ecommerce/shared";

export interface TOrderItemSkuProduct {
  id: string;
  slug: string;
  name: string;
  thumbnailUrl?: string;
  basePrice: number;
  rating: number;
}

export interface TOrderItem {
  id: string;
  skuId: string;
  quantity: number;
  price: number;
  flashSaleId: string | null;
  originalPrice?: number | null;
  attributes?: string;
  snapshot: IOrderItemSnapshot | null;
  // Virtual field mapped from snapshot for UI convenience
  sku?: {
    id: string;
    skuCode: string;
    imageUrl?: string;
    product?: TOrderItemSkuProduct;
  };
}

export interface TShippingAddress {
  id: string;
  receiverName: string;
  receiverPhone: string;
  label: number;
  latitude: number;
  longitude: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TOrder {
  id: string;
  userId: string;
  status: EOrderStatus;
  totalAmount: number;
  discountAmount: number;
  shippingAddressId: string | null;
  couponId: string | null;
  createdAt: string;
  updatedAt: string;
  items: TOrderItem[];
  shippingAddress?: TShippingAddress | null;
}

export type TPlaceOrderRequest = {
  cartItemIds: string[];
  shippingAddressId: string;
};

export type TGetOrdersRequest = {
  status?: number[];
  page?: number;
  limit?: number;
};
