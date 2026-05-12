import { IProduct } from "../types/products.model";
import { IProductResponse } from "../types/products.response";

export class ProductMapper {
  static toDomain(dto: IProductResponse, lang: string = "vi"): IProduct {
    const translation =
      dto.translations?.find((t) => t.language_id === lang) ||
      dto.translations?.[0];
    const sku = dto.skus?.[0];

    return {
      id: String(dto.id),
      name: translation?.name || "No Name",
      price: sku ? String(sku.price) : "0",
      category: dto.category?.name || "General",
      image_url: dto.thumbnail?.url || sku?.image_url || "",
    };
  }
}
