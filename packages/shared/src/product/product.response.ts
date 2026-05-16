import type {
  Product,
  ProductTranslation,
  Sku,
  Image,
  ProductCategoryMapping,
  FlashSale,
  FlashSaleProduct,
  SkuAttributeValue,
  AttributeValue,
  Attribute,
  ProductCategory,
  ProductCategoryTranslation,
} from "../generate/browser";
import type { IPaginatedResult } from "../paginate";
import type { IBrandResponse } from "../brand/brand.response";

export interface ISkuResponse extends Sku {
  flash_sales?: (FlashSaleProduct & {
    flash_sale?: FlashSale;
  })[];
  sku_attribute_values?: (SkuAttributeValue & {
    attribute_value?: AttributeValue & {
      attribute?: Attribute;
    };
  })[];
  product?: IProductResponse;
}

export interface IProductResponse extends Product {
  translations?: ProductTranslation[];
  thumbnail?: Image | null;
  brand?: IBrandResponse | null;
  categories?: (ProductCategoryMapping & {
    category?: ProductCategory & {
      translations?: ProductCategoryTranslation[];
    };
  })[];
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
