export * from "../generate/browser";

export enum EOrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  PROCESSING = 2,
  SHIPPING = 3,
  DELIVERED = 4,
  CANCELLED = 5,
  REFUNDED = 6,
}

export interface IOrderItemSnapshot {
  sku: {
    id: string;
    sku_code: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    unit_price: string | null;
    attributes: string | null;
    product: {
      id: string;
      slug: string;
      name: string;
      thumbnail_url: string | null;
      base_price: number;
      rating: number;
    };
  };
}
