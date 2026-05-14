export interface IOrder {
  id: string;
  status: number;
  totalAmount: number;
  discountAmount: number;
  createdAt: Date;
}

export interface IOrderItem {
  id: string;
  skuId: string;
  quantity: number;
  price: number;
}
