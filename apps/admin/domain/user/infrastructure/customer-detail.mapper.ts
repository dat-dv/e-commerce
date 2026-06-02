import type {
  ICartResponse,
  IOrderResponse,
  IUserFavoriteProductResponse,
} from "@ecommerce/shared";

import type {
  IAdminCustomerCart,
  IAdminCustomerCartItem,
  IAdminCustomerFavoriteProduct,
  IAdminCustomerOrder,
} from "../types/user.model";

const toIsoString = (date?: Date | string | null): string =>
  date ? new Date(date).toISOString() : "";

const getProductName = (
  product?: { translations?: { name: string }[]; slug?: string } | null,
): string => product?.translations?.[0]?.name || product?.slug || "Untitled";

export const AdminCustomerDetailMapper = {
  orderToDomain(dto: IOrderResponse): IAdminCustomerOrder {
    return {
      id: dto.id,
      status: dto.status,
      totalAmount: Number(dto.total_amount),
      discountAmount: Number(dto.discount_amount),
      createdAt: toIsoString(dto.created_at),
      updatedAt: toIsoString(dto.updated_at),
      itemCount: dto.items?.length ?? 0,
    };
  },

  cartToDomain(dto: ICartResponse | null | undefined): IAdminCustomerCart {
    const items =
      dto?.items?.map((item) =>
        AdminCustomerDetailMapper.cartItemToDomain(item),
      ) ?? [];

    return {
      id: dto?.id ?? "",
      createdAt: toIsoString(dto?.created_at),
      updatedAt: toIsoString(dto?.updated_at),
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
      ),
    };
  },

  cartItemToDomain(
    dto: NonNullable<ICartResponse["items"]>[number],
  ): IAdminCustomerCartItem {
    const sku = dto.sku;
    const product = sku?.product;

    return {
      id: dto.id,
      skuId: dto.sku_id,
      skuCode: sku?.sku_code ?? "-",
      productName: getProductName(product),
      productSlug: product?.slug ?? "",
      thumbnailUrl: product?.thumbnail?.url ?? null,
      quantity: dto.quantity,
      price: Number(sku?.price ?? 0),
      unitPrice: sku?.unit_price ?? "VND",
    };
  },

  favoriteToDomain(
    dto: IUserFavoriteProductResponse,
  ): IAdminCustomerFavoriteProduct {
    return {
      productId: dto.product_id,
      productName: getProductName(dto.product),
      productSlug: dto.product?.slug ?? "",
      thumbnailUrl: dto.product?.thumbnail?.url ?? null,
      basePrice: Number(dto.product?.base_price ?? 0),
      createdAt: toIsoString(dto.created_at),
    };
  },
};
