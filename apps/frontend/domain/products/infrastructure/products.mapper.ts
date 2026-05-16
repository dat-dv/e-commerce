import { TProduct, TSkuDomain } from "../types/products.model";
import {
  IProductResponse,
  ISkuResponse,
  IBrandResponse,
  ICategoryResponse,
} from "@ecommerce/shared";

// Extended types to handle relations not explicitly defined in base DTOs
type IBrandWithRelations = IBrandResponse & {
  name?: string;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  translations?: { name: string; description: string }[];
  logo?: { url: string };
};

type ISkuWithRelations = ISkuResponse & {
  product?: IProductResponse;
  sku_attribute_values?: {
    attribute_value: {
      value: string;
      translations?: { value: string }[];
      attribute: {
        name: string;
        translations?: { name: string }[];
      };
    };
  }[];
  image_url?: string;
};

type IFlashSaleWithRelations = {
  sale_price: number;
  sold_count: number;
  stock: number;
  flash_sale: {
    start_time: string | Date;
    end_time: string | Date;
  };
};

export class ProductMapper {
  static toDomain(dto: IProductResponse): TProduct {
    const translation = dto.translations?.[0];
    const brand = dto.brand as IBrandWithRelations | undefined;
    const brandTranslation = brand?.translations?.[0];

    const skus: TSkuDomain[] =
      dto.skus?.map((skuDto: ISkuResponse) => {
        const sku = skuDto as ISkuWithRelations;
        const flashSale = sku.flash_sales?.[0] as
          | IFlashSaleWithRelations
          | undefined;
        const salePrice = flashSale?.sale_price;
        const regularPrice = sku.price;

        const displayPrice = salePrice || regularPrice || 0;
        const strikePrice = salePrice ? regularPrice : sku.original_price;

        const discountPercent =
          strikePrice && displayPrice && strikePrice > displayPrice
            ? Math.round(((strikePrice - displayPrice) / strikePrice) * 100)
            : undefined;

        return {
          id: sku.id,
          price: displayPrice,
          unitPrice: displayPrice.toString(),
          originalPrice:
            strikePrice && displayPrice && strikePrice > displayPrice
              ? strikePrice
              : undefined,
          discountPercent: discountPercent,
          sold: flashSale?.sold_count,
          total: flashSale?.stock,
          flashSaleStart: flashSale?.flash_sale?.start_time?.toString(),
          flashSaleEnd: flashSale?.flash_sale?.end_time?.toString(),
          imageUrl: sku.image_url || undefined,
          attributes:
            sku.sku_attribute_values?.map((sav) => {
              const attrVal = sav.attribute_value;
              const attr = attrVal?.attribute;

              const attrName = attr?.translations?.[0]?.name || attr?.name;
              const valName =
                attrVal?.translations?.[0]?.value || attrVal?.value;

              return {
                name: attrName || "Unknown",
                value: valName || "Unknown",
              };
            }) || [],
        };
      }) || [];

    const categoryMapping = dto.categories?.[0] as
      | { category: ICategoryResponse }
      | undefined;
    const categoryName =
      categoryMapping?.category?.translations?.[0]?.name ||
      categoryMapping?.category?.slug;

    return {
      id: String(dto.id),
      slug: dto.slug || String(dto.id),
      name: translation?.name || "No Name",
      description: translation?.description || "",
      category: categoryName || "General",
      imageUrl: dto.thumbnail?.url || skus[0]?.imageUrl || "",
      brand: brand
        ? {
            id: brand.id,
            slug: brand.slug,
            name: brandTranslation?.name || brand.name || "No Name",
            logoUrl: brand.logo?.url || brand.logo_url || "",
            description:
              brandTranslation?.description || brand.description || "",
          }
        : undefined,
      skus,
      rating: dto.rating,
      soldCount: dto.sold_count,
      reviewCount: dto.review_count,
    };
  }
}
