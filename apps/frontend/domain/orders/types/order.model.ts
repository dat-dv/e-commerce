import { TProduct } from "@/domain/product/types/product.model";

export interface IOrderItem {
  id: string;
  skuId: string;
  quantity: number;
  price: number;
  flashSaleId?: string;
  sku?: {
    id: string;
    skuCode: string;
    imageUrl?: string;
    product?: TProduct;
  };
}

export interface IOrder {
  id: string;
  status: number;
  totalAmount: number;
  discountAmount: number;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
