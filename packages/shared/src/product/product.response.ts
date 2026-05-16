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
  AttributeTranslation,
  AttributeValueTranslation,
  Category,
  CategoryTranslation,
} from "../generate/browser";
import type { IPaginatedResult } from "../paginate";
import type { IBrandResponse } from "../brand/brand.response";

export interface ISkuResponse extends Sku {
  flash_sales?: (FlashSaleProduct & {
    flash_sale?: FlashSale;
  })[];
  sku_attribute_values?: (SkuAttributeValue & {
    attribute_value?: AttributeValue & {
      translations?: AttributeValueTranslation[];
      attribute?: Attribute & {
        translations?: AttributeTranslation[];
      };
    };
  })[];
  image_url?: string;
  product?: IProductResponse;
}

export interface IProductResponse extends Product {
  translations?: ProductTranslation[];
  thumbnail?: Image | null;
  brand?: IBrandResponse | null;
  categories?: (ProductCategoryMapping & {
    category?: Category & {
      translations?: CategoryTranslation[];
    };
  })[];
  skus?: ISkuResponse[];
  rating?: number;
  sold_count?: number;
  review_count?: number;
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
