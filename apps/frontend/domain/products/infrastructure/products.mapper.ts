import { TProduct, TSkuDomain } from "../types/products.model";
import { IProduct } from "@ecommerce/shared";

export class ProductMapper {
  static toDomain(dto: IProduct, lang: string = "vi"): TProduct {
    const translation =
      dto.translations?.find((t) => t.language_id === lang) ||
      dto.translations?.[0];

    const skus: TSkuDomain[] =
      dto.skus?.map((sku) => {
        const flashSale = sku.flash_sales?.[0];
        const salePrice = flashSale?.sale_price;
        const regularPrice = sku.price;

        const displayPrice = salePrice || regularPrice;
        const strikePrice = salePrice ? regularPrice : sku.original_price;

        const discountPercent =
          strikePrice && strikePrice > displayPrice
            ? Math.round(((strikePrice - displayPrice) / strikePrice) * 100)
            : undefined;

        return {
          id: sku.id,
          price: displayPrice.toLocaleString("vi-VN") + " ₫",
          unit_price: displayPrice.toString(),
          original_price:
            strikePrice && strikePrice > displayPrice
              ? strikePrice.toLocaleString("vi-VN") + " ₫"
              : undefined,
          discount_percent: discountPercent,
          sold: flashSale?.sold_count,
          total: flashSale?.stock,
          image_url: sku.image_url || undefined,
          attributes:
            sku.sku_attribute_values?.map((sav) => {
              const attrVal = sav.attribute_value;
              const attr = attrVal?.attribute;

              const attrNameTranslation =
                attr?.translations?.find((t) => t.language_id === lang) ||
                attr?.translations?.[0];
              const valTranslation =
                attrVal?.translations?.find((t) => t.language_id === lang) ||
                attrVal?.translations?.[0];

              return {
                name: attrNameTranslation?.name || attr?.name || "Unknown",
                value: valTranslation?.value || attrVal?.value || "Unknown",
              };
            }) || [],
        };
      }) || [];

    return {
      id: String(dto.id),
      slug: dto.slug || String(dto.id),
      name: translation?.name || "No Name",
      category: "General",
      image_url: dto.thumbnail?.url || skus[0]?.image_url || "",
      skus,
    };
  }
}
