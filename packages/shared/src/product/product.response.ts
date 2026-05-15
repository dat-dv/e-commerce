import {
  Product,
  IPaginatedResult,
  ProductTranslation,
  Sku,
  Image,
  Brand,
  ProductCategoryMapping,
  FlashSale,
  FlashSaleProduct,
} from "../index";

export interface ISkuResponse extends Sku {
  flash_sales?: FlashSaleProduct[];
}

export interface IProductResponse extends Product {
  translations?: ProductTranslation[];
  thumbnail?: Image | null;
  brand?: Brand | null;
  categories?: ProductCategoryMapping[];
  skus?: ISkuResponse[];
}

export type IProductDetailResponse = IProductResponse;

export type IProductListResponse = IPaginatedResult<IProductResponse>;

export interface IFlashSaleResponse extends FlashSale {
  products: (FlashSaleProduct & {
    sku: ISkuResponse & {
      product: IProductResponse;
    };
  })[];
}
