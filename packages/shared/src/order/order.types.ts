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

export interface IOrderItem {
  id: string;
  order_id: string;
  sku_id: string;
  flash_sale_id?: string | null;
  quantity: number;
  price: number;
  snapshot?: IOrderItemSnapshot | any;
}

export interface IOrder {
  id: string;
  user_id: string;
  status: EOrderStatus;
  total_amount: number;
  discount_amount: number;
  shipping_address_id?: string | null;
  coupon_id?: string | null;
  created_at: Date;
  updated_at: Date;
  items?: IOrderItem[];
}
