"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TProduct } from "@/domain/products/types/products.model";
import { cn } from "@/utils/cn";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, ReactNode } from "react";

interface ProductCardMediaProps {
  product: TProduct;
  noImageLabel: string;
  addToCartClassName: string;
  onAddToCart: (event: MouseEvent) => void;
  badges?: ReactNode;
  cornerBadge?: ReactNode;
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
  favoriteLoading?: boolean;
  onToggleFavorite?: () => void;
  viewDetailsTitle?: string;
  addToCartTitle?: string;
}

export function ProductCardMedia({
  product,
  noImageLabel,
  addToCartClassName,
  onAddToCart,
  badges,
  cornerBadge,
  showFavoriteButton = false,
  isFavorited = false,
  favoriteLoading = false,
  onToggleFavorite,
  viewDetailsTitle,
  addToCartTitle,
}: ProductCardMediaProps) {
  const t = useTranslations("Common.productCard");

  return (
    <div
      className={cn(
        UI_RADIUS.media,
        "relative flex aspect-square items-center justify-center overflow-hidden bg-transparent",
      )}
    >
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
          {noImageLabel}
        </div>
      )}

      <div className="invisible absolute inset-0 flex items-center justify-center gap-3 bg-black/40 group-hover:visible">
        <Link
          href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-white/90"
          title={viewDetailsTitle}
          aria-label={viewDetailsTitle || t("viewDetails")}
        >
          <Eye size={18} aria-hidden />
        </Link>
        <Button
          onClick={onAddToCart}
          variant="ghost"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full p-0 opacity-100 shadow-lg transition-all group-hover:shadow-xl group-hover:brightness-110 hover:opacity-100 active:scale-90",
            addToCartClassName,
          )}
          title={addToCartTitle}
          aria-label={addToCartTitle || t("addToCart")}
        >
          <ShoppingBag size={18} aria-hidden />
        </Button>
      </div>

      {badges ? (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {badges}
        </div>
      ) : null}

      {cornerBadge}

      {showFavoriteButton && (
        <Button
          onClick={onToggleFavorite}
          disabled={favoriteLoading}
          aria-label={
            isFavorited ? t("removeFromWishlist") : t("addToWishlist")
          }
          className={cn(
            "group/favorite absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full p-0 opacity-100 shadow-lg transition-all duration-300",
            "group-hover:shadow-xl group-hover:brightness-110 hover:opacity-100 active:scale-75",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "[-webkit-tap-highlight-color:transparent]",
            isFavorited
              ? "bg-red-500 shadow-red-500/20 hover:bg-red-500 active:bg-red-500"
              : "bg-surface hover:bg-surface active:bg-surface backdrop-blur-md",
          )}
        >
          <Heart
            size={16}
            className={cn(
              "pointer-events-none transition-colors duration-200",
              isFavorited
                ? "fill-white stroke-white"
                : "stroke-content fill-transparent group-hover:stroke-red-500 group-hover/favorite:stroke-red-500",
            )}
            aria-hidden
          />
        </Button>
      )}
    </div>
  );
}
