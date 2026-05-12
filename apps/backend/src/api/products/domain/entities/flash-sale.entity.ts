export interface IFlashSaleProduct {
  sku: {
    id: string;
    price: number;
    product: {
      id: string;
      translations?: { name: string }[];
    };
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
