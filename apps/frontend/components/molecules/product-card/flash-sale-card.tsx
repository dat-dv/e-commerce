"use client";

import Button from "@/components/atoms/button";
import { toast } from "@/components/ui/toast";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { cn } from "@/utils/cn";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { ProductCardInfo } from "./product-card-info";
import { ProductCardMedia } from "./product-card-media";
import { ProductCardPrice } from "./product-card-price";
import { getProductBadgeText, getSkuPriceDisplay } from "./product-card.utils";

export const FlashSaleCard = ({ product }: { product: TFlashSaleProduct }) => {
  const t = useTranslations("FlashSalePage.card");
  const tCart = useTranslations("CartPage.toasts");
  const addItem = useAddToCart();
  const sku = product.skus[0];

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info(tCart("signInRequired"));
      const productDetailUrl = APP_ROUTES.PRODUCT_DETAIL(product.slug);
      const callbackUrl = encodeURIComponent(productDetailUrl);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    const priceNumber = sku?.price || 0;

    addItem(
      {
        id: sku?.id || `sku-${product.id}`,
        productId: String(product.id),
        skuId: sku?.id || `sku-${product.id}`,
        name: product.name,
        price: isNaN(priceNumber) ? 0 : priceNumber,
        imageUrl: product.imageUrl || sku?.imageUrl || "",
        attributes: t("badge"),
      },
      1,
    );
    toast.success(tCart("addSuccess"));
  };

  const currentPriceNum = sku?.price || 0;
  const oldPriceNum = sku?.originalPrice || 0;

  const discountPercent =
    oldPriceNum > 0 ? Math.round((1 - currentPriceNum / oldPriceNum) * 100) : 0;

  const soldCount = sku?.sold || 0;
  const totalCount = sku?.total || 1;
  const stockLeft = Math.max(0, totalCount - soldCount);
  const progressWidth = `${(soldCount / totalCount) * 100}%`;
  const priceDisplay = getSkuPriceDisplay(sku);
  const badgeText = getProductBadgeText(product, t("badge"));

  return (
    <div
      className={cn(
        UI_RADIUS.card,
        "group bg-content/[0.02] relative flex h-full flex-col border border-red-500/10 p-3 transition-all duration-300 hover:border-red-500/25 hover:shadow-xl hover:shadow-red-500/5",
      )}
    >
      <ProductCardMedia
        product={product}
        noImageLabel={t("noImage")}
        addToCartClassName="bg-red-500 text-white hover:bg-red-600"
        onAddToCart={handleAddToCart}
        viewDetailsTitle={t("viewDetails")}
        addToCartTitle={t("addToCart")}
        badges={
          <div
            className={cn(
              UI_RADIUS.badge,
              `bg-red-500 text-white ${TYPOGRAPHY.badge} px-2 py-0.5 shadow-lg shadow-red-500/20`,
            )}
          >
            -{discountPercent}%
          </div>
        }
        cornerBadge={
          <div
            className={`absolute top-2 right-2 z-10 rounded-full bg-red-500/10 px-2 py-1 ${TYPOGRAPHY.badge} tracking-wide text-red-500 uppercase backdrop-blur-md`}
          >
            {t("sale")}
          </div>
        }
      />

      <ProductCardInfo
        product={product}
        badgeText={badgeText}
        titleHoverClassName="group-hover:text-red-500"
      >
        <div className="mt-2">
          <div className="bg-content/[0.05] h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              style={{
                width: progressWidth,
              }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className={`${TYPOGRAPHY.badge} text-content/60`}>
              {t("sold", { count: String(soldCount) })}
            </span>
            <span className={`${TYPOGRAPHY.badge} text-content/40`}>
              {t("left", { count: String(stockLeft) })}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <ProductCardPrice
            price={priceDisplay.price}
            originalPrice={priceDisplay.originalPrice}
            hasOriginalPrice={priceDisplay.hasOriginalPrice}
            priceClassName="text-red-500"
          />

          <Button
            onClick={handleAddToCart}
            variant="ghost"
            className={cn(
              UI_RADIUS.control,
              "flex h-9 w-9 items-center justify-center border border-red-500/10 p-0 text-red-500 hover:bg-red-500/10 lg:hidden",
            )}
            title={t("addToCart")}
          >
            <ShoppingBag size={18} aria-hidden />
          </Button>
        </div>
      </ProductCardInfo>
    </div>
  );
};
