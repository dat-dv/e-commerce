import { IProduct, ISku } from './product.entity';

export interface IFlashSaleProduct {
  sku: ISku & {
    product: IProduct;
  };
  sale_price: number;
  sold_count: number;
  stock: number;
}

export interface IFlashSale {
  id: string;
  name: string;
  end_time: Date;
  products: IFlashSaleProduct[];
}
