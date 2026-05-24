export interface ICreateFlashSaleProductRequest {
  sku_id: string;
  sale_price: number;
  stock: number;
  order_limit?: number;
}

export interface ICreateFlashSaleRequest {
  name: string;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  time_slot_id?: string;
  products: ICreateFlashSaleProductRequest[];
}
