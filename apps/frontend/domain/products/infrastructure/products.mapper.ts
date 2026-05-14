import { TProduct, TSkuDomain } from "../types/products.model";
import { IProduct } from "@ecommerce/shared";

export class ProductMapper {
  static toDomain(dto: IProduct): TProduct {
    const translation = dto.translations?.[0];
    const brandTranslation = dto.brand?.translations?.[0];

    const skus: TSkuDomain[] =
      dto.skus?.map((sku) => {
        const flashSale = sku.flash_sales?.[0];
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
          unit_price: displayPrice.toString(),
          original_price:
            strikePrice && displayPrice && strikePrice > displayPrice
              ? strikePrice
              : undefined,
          discount_percent: discountPercent,
          sold: flashSale?.sold_count,
          total: flashSale?.stock,
          flash_sale_start: flashSale?.flash_sale?.start_time?.toString(),
          flash_sale_end: flashSale?.flash_sale?.end_time?.toString(),
          image_url: sku.image_url || undefined,
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

    const categoryMapping = dto.categories?.[0];
    const categoryName =
      categoryMapping?.category?.translations?.[0]?.name ||
      categoryMapping?.category?.slug;

    return {
      id: String(dto.id),
      slug: dto.slug || String(dto.id),
      name: translation?.name || "No Name",
      description: translation?.description || "",
      category: categoryName || "General",
      image_url: dto.thumbnail?.url || skus[0]?.image_url || "",
      brand: dto.brand
        ? {
            id: dto.brand.id,
            slug: dto.brand.slug,
            name: brandTranslation?.name || dto.brand.name || "No Name",
            logo_url: dto.brand.logo?.url || dto.brand.logo_url || "",
            description:
              brandTranslation?.description || dto.brand.description || "",
          }
        : undefined,
      skus,
      rating: dto.rating,
      sold_count: dto.sold_count,
    };
  }
}
