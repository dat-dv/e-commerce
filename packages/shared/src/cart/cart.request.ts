export interface IAddToCartRequest {
  sku_id: string;
  quantity: number;
}

export interface IUpdateCartItemRequest {
  quantity: number;
}
