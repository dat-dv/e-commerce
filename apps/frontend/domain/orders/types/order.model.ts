export interface IOrderItemSkuProduct {
  id: string;
  slug: string;
  name: string;
  thumbnailUrl?: string;
  basePrice: number;
  rating: number;
}

export interface IOrderItem {
  id: string;
  skuId: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  attributes?: string;
  flashSaleId?: string;
  sku?: {
    id: string;
    skuCode: string;
    imageUrl?: string;
    product?: IOrderItemSkuProduct;
  };
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface IOrder {
  id: string;
  status: number;
  totalAmount: number;
  discountAmount: number;
  items: IOrderItem[];
  shippingAddress?: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}
