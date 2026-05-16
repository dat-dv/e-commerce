import { TCart } from "../types/cart.model";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { ICartResponse, ICartItemResponse } from "@ecommerce/shared";

export class CartMapper {
  static toDomainItem(dto: ICartItemResponse): TCartItem {
    const sku = dto.sku;
    const flashSalePrice = sku?.flash_sales?.[0]?.sale_price;
    const price = flashSalePrice ?? sku?.price ?? 0;

    return {
      id: dto.id,
      productId: sku?.product_id || "",
      skuId: dto.sku_id,
      name: sku?.product?.translations?.[0]?.name || "Unnamed Product",
      price: price,
      originalPrice: sku?.original_price || sku?.price,
      discountPercent:
        sku?.original_price && sku.original_price > price
          ? Math.round((1 - price / sku.original_price) * 100)
          : null,
      quantity: dto.quantity,
      imageUrl: sku?.product?.thumbnail?.url || null,
      attributes: "", // TODO: Fetch SKU attributes if needed
    };
  }

  static toDomain(dto: ICartResponse): TCart {
    return {
      id: dto.id,
      userId: dto.user_id,
      items: dto.items?.map((item) => this.toDomainItem(item)) || [],
    };
  }
}
