"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { Eye, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { CALLBACK_URL_KEY } from "@/constants/routes";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useTranslations } from "next-intl";

export const FlashSaleCard = ({ product }: { product: TFlashSaleProduct }) => {
  const t = useTranslations("FlashSalePage.card");
  const tCart = useTranslations("CartPage.toasts");
  const addItem = useAddToCart();
  const sku = product.skus[0];

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail

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

  const displayPrice = formatCurrency(sku?.price);
  const displayOriginalPrice = formatCurrency(sku?.originalPrice);

  const hasOriginalPrice = !!sku?.originalPrice;

  const badgeText =
    product.brand?.name ||
    (product.category !== "General" ? product.category : t("badge"));

  return (
    <div className="group relative flex h-full flex-col bg-content/[0.02] border border-red-500/10 rounded-2xl p-3 transition-all duration-300 hover:border-red-500/25 hover:shadow-xl hover:shadow-red-500/5">
      {/* Image Section */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-transparent flex items-center justify-center">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain transition-transform duration-500"
          />
        ) : (
          <div className="text-content/20 text-xs font-semibold">
            {t("noImage")}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg shadow-red-500/20">
            -{discountPercent}%
          </div>
        </div>

        <div className="absolute top-2 right-2 z-10 rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-red-500 backdrop-blur-md">
          {t("sale")}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-all"
            title={t("viewDetails")}
          >
            <Eye size={18} aria-hidden />
          </Link>
          <Button
            onClick={handleAddToCart}
            variant="ghost"
            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg active:scale-90 p-0"
            title={t("addToCart")}
          >
            <ShoppingBag size={18} aria-hidden />
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3 flex flex-col flex-grow">
        <span className="text-[10px] text-content/40 font-bold truncate">
          {badgeText}
        </span>

        <h3 className="mt-1 text-sm font-bold text-content line-clamp-1 group-hover:text-red-500 transition-colors">
          <Link href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}>
            {product.name}
          </Link>
        </h3>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full h-1.5 bg-content/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              style={{
                width: progressWidth,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] font-bold text-content/60">
              {t("sold", { count: String(soldCount) })}
            </span>
            <span className="text-[10px] font-bold text-content/40">
              {t("left", { count: String(stockLeft) })}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-black text-red-500 tracking-tight">
              {displayPrice}
            </span>
            {hasOriginalPrice && (
              <span className="text-[10px] text-content/20 line-through font-medium">
                {displayOriginalPrice}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            variant="ghost"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 lg:hidden border border-red-500/10 p-0"
            title={t("addToCart")}
          >
            <ShoppingBag size={18} aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
};
