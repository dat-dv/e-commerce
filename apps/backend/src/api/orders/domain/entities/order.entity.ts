export interface IOrderItem {
  id: string;
  order_id: string;
  sku_id: string;
  flash_sale_id?: string | null;
  quantity: number;
  price: number;
}

export interface ICreateOrderItemInput {
  sku_id: string;
  quantity: number;
  price: number;
  flash_sale_id?: string | null;
}

export interface IOrder {
  id: string;
  user_id: string;
  status: number;
  total_amount: number;
  discount_amount: number;
  shipping_address_id?: string | null;
  coupon_id?: string | null;
  created_at: Date;
  updated_at: Date;
  items?: IOrderItem[];
}

export interface ICreateOrderInput {
  user_id: string;
  total_amount: number;
  discount_amount: number;
  shipping_address_id?: string | null;
  coupon_id?: string | null;
  items: ICreateOrderItemInput[];
}
