import { IProduct, ISkuDomain } from "../types/products.model";
import { IProductResponse } from "../types/products.response";

export class ProductMapper {
  static toDomain(dto: IProductResponse, lang: string = "vi"): IProduct {
    const translation =
      dto.translations?.find((t) => t.language_id === lang) ||
      dto.translations?.[0];

    const skus: ISkuDomain[] =
      dto.skus?.map((sku) => {
        const currentPrice = sku.sale_price || sku.price || 0;
        const originalPrice = sku.original_price || sku.price || 0;
        const discountPercent =
          originalPrice > currentPrice
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : 0;

        return {
          id: sku.id,
          price: currentPrice.toLocaleString("vi-VN") + " ₫",
          original_price:
            originalPrice > currentPrice
              ? originalPrice.toLocaleString("vi-VN") + " ₫"
              : undefined,
          discount_percent: discountPercent > 0 ? discountPercent : undefined,
          sold: sku.sold,
          total: sku.total,
          image_url: sku.image_url || undefined,
        };
      }) || [];

    return {
      id: String(dto.id),
      name: translation?.name || "No Name",
      category: dto.category?.name || "General",
      image_url: dto.thumbnail?.url || skus[0]?.image_url || "",
      skus,
    };
  }
}
