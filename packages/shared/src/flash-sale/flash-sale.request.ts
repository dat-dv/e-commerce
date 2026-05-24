export interface ICreateFlashSaleProductRequest {
  sku_id: string;
  sale_price: number;
  stock: number;
  order_limit?: number;
}

export interface ICreateFlashSaleRequest {
  name: string;
  start_time: string;
  end_time: string;
  time_slot_id?: string;
  products: ICreateFlashSaleProductRequest[];
}

export interface ICreateFlashSalesBatchRequest {
  flash_sales: ICreateFlashSaleRequest[];
}

export interface ICreateTimeSlotRequest {
  name: string;
  start_hour: number;
  start_minute?: number;
  end_hour: number;
  end_minute?: number;
  is_active?: boolean;
}

export interface ICreateTimeSlotsBatchRequest {
  slots: ICreateTimeSlotRequest[];
}
