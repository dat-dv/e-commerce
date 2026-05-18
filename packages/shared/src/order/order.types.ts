export enum EOrderStatus {
  PENDING = 300,
  PAID = 301,
  SHIPPING = 302,
  DELIVERED = 303,

  CANCEL_REQUESTED = 304,
  CANCEL_PROCESSING = 305,
  CANCELLED = 306,

  RETURN_REQUESTED = 307,
  RETURN_PROCESSING = 308,
  RETURNED = 309,
  RETURN_REJECTED = 310,
}

export enum EOrderSortBy {
  CREATED_AT = "created_at",
  TOTAL_AMOUNT = "total_amount",
  STATUS = "status",
}

export enum EOrderReturnStatus {
  PENDING = 320,
  PROCESSING = 321,
  APPROVED = 322,
  REJECTED = 323,
  CANCELLED = 324,
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
