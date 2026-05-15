import { TCart } from "../types/cart.model";
import { TCartItem } from "@/store/cart-store/cart-store.type";

export interface ICartItemDTO {
  id: string;
  sku_id: string;
  quantity: number;
  sku: {
    id: string;
    product_id: string;
    price: number;
    original_price?: number;
    product: {
      id: string;
      translations: Array<{
        name: string;
      }>;
      thumbnail_url?: string;
    };
    flash_sales: Array<{
      sale_price: number;
    }>;
  };
}

export interface ICartDTO {
  id: string;
  user_id: string;
  items: ICartItemDTO[];
}

export class CartMapper {
  static toDomainItem(dto: ICartItemDTO): TCartItem {
    const flashSalePrice = dto.sku?.flash_sales?.[0]?.sale_price;
    const price = flashSalePrice ?? dto.sku?.price ?? 0;

    return {
      id: dto.id,
      product_id: dto.sku?.product_id || "",
      sku_id: dto.sku_id,
      name: dto.sku?.product?.translations?.[0]?.name || "Unnamed Product",
      price: price,
      original_price: dto.sku?.original_price || dto.sku?.price,
      discount_percent:
        dto.sku?.original_price && dto.sku.original_price > price
          ? Math.round((1 - price / dto.sku.original_price) * 100)
          : null,
      quantity: dto.quantity,
      image_url: dto.sku?.product?.thumbnail_url || null,
      attributes: "", // TODO: Fetch SKU attributes if needed
    };
  }

  static toDomain(dto: ICartDTO): TCart {
    return {
      id: dto.id,
      user_id: dto.user_id,
      items: dto.items.map(this.toDomainItem),
    };
  }
}
