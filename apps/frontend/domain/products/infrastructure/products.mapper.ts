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

        // Logic: Nếu có Flash Sale, giá hiển thị là salePrice, giá gạch đi (original) là regularPrice.
        // Nếu không có, giá hiển thị là regularPrice, giá gạch đi là sku.original_price.
        const displayPrice = salePrice || regularPrice;
        const strikePrice = salePrice ? regularPrice : sku.original_price;

        const discountPercent =
          strikePrice && strikePrice > displayPrice
            ? Math.round(((strikePrice - displayPrice) / strikePrice) * 100)
            : undefined;

        return {
          id: sku.id,
          price: displayPrice.toLocaleString("vi-VN") + " ₫",
          original_price:
            strikePrice && strikePrice > displayPrice
              ? strikePrice.toLocaleString("vi-VN") + " ₫"
              : undefined,
          discount_percent: discountPercent,
          sold: flashSale?.sold_count,
          total: flashSale?.stock,
          image_url: sku.image_url || undefined,
        };
      }) || [];

    return {
      id: String(dto.id),
      name: translation?.name || "No Name",
      category: "General",
      image_url: dto.thumbnail?.url || skus[0]?.image_url || "",
      skus,
    };
  }
}
