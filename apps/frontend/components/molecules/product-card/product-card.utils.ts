import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";
import { formatCurrency } from "@/utils/format-currency";

export const getProductBadgeText = (
  product: TProduct,
  fallback = "",
): string => {
  return (
    product.brand?.name ||
    (product.category !== "General" ? product.category : fallback)
  );
};

export const getFormattedSoldCount = (
  soldCount?: number,
): string | number | undefined => {
  if (soldCount === undefined || soldCount <= 0) return undefined;

  return soldCount > 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount;
};

export const getSkuPriceDisplay = (sku?: TSkuDomain) => ({
  price: formatCurrency(sku?.price),
  originalPrice: formatCurrency(sku?.originalPrice),
  hasOriginalPrice: Boolean(sku?.originalPrice),
});
