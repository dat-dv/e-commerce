import type {
  ICartResponse,
  IOrderResponse,
  IUserFavoriteProductResponse,
} from "@ecommerce/shared";

import type {
  IAdminCustomerActivityItem,
  IAdminCustomerCart,
  IAdminCustomerCartItem,
  IAdminCustomerFavoriteProduct,
  IAdminCustomerOrder,
  IAdminUser,
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

  buildActivity(input: {
    user: IAdminUser | null;
    orders: IAdminCustomerOrder[];
    cart: IAdminCustomerCart;
    favorites: IAdminCustomerFavoriteProduct[];
  }): IAdminCustomerActivityItem[] {
    const items: IAdminCustomerActivityItem[] = [];

    if (input.user) {
      items.push({
        id: `account-created-${input.user.id}`,
        type: "account",
        title: "Account created",
        description: input.user.email,
        occurredAt: input.user.createdAt,
      });

      if (
        input.user.updatedAt &&
        input.user.updatedAt !== input.user.createdAt
      ) {
        items.push({
          id: `account-updated-${input.user.id}`,
          type: "account",
          title: "Profile updated",
          description: "Customer profile information changed.",
          occurredAt: input.user.updatedAt,
        });
      }
    }

    input.orders.forEach((order) => {
      items.push({
        id: `order-${order.id}`,
        type: "order",
        title: `Order #${order.id.slice(0, 8).toUpperCase()}`,
        description: `${order.itemCount} items · ${order.totalAmount.toLocaleString()}`,
        occurredAt: order.createdAt,
      });
    });

    input.favorites.forEach((favorite) => {
      items.push({
        id: `favorite-${favorite.productId}`,
        type: "favorite",
        title: "Favorited product",
        description: favorite.productName,
        occurredAt: favorite.createdAt,
      });
    });

    if (input.cart.items.length > 0 && input.cart.updatedAt) {
      items.push({
        id: `cart-${input.cart.id}`,
        type: "cart",
        title: "Cart updated",
        description: `${input.cart.totalItems} items in cart.`,
        occurredAt: input.cart.updatedAt,
      });
    }

    return items.sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
  },
};
