import { ISku } from "../product/product.types";

export interface IFlashSaleTimeSlot {
  id: string;
  name: string;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  is_active: boolean;
}

export interface IFlashSaleProduct {
  id: string;
  flash_sale_id: string;
  sku_id: string;
  sale_price: number;
  sold_count: number;
  stock: number;
  order_limit: number;
  sku?: ISku;
}

export interface IFlashSale {
  id: string;
  name: string;
  start_time: Date;
  end_time: Date;
  time_slot_id?: string | null;
  time_slot?: IFlashSaleTimeSlot | null;
  products: IFlashSaleProduct[];
}
