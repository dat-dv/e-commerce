export interface ICreateOrderRequest {
  cartItemIds: string[];
  shippingAddressId?: string;
  promoCode?: string;
}

export interface IGetUserOrdersRequest {
  status?: number[];
  page?: number;
  limit?: number;
}
