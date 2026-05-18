import { IOrderItemSnapshot, EOrderSortBy, EOrderStatus, ESortValue } from '@ecommerce/shared';

export class CreateOrderInputDto {
  user_id: string;
  total_amount: number;
  discount_amount?: number;
  shipping_address_id?: string;
  coupon_id?: string;
  items: {
    sku_id: string;
    quantity: number;
    price: number;
    flash_sale_id?: string;
    snapshot?: IOrderItemSnapshot;
  }[];
}

export class GetUserOrdersDto {
  status?: EOrderStatus[];
  page?: number;
  limit?: number;
}

export class GetAllOrdersInputDto {
  status?: EOrderStatus[];
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: EOrderSortBy;
  sort_order?: ESortValue;
  user_id?: string;
}
