"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TProduct } from "@/domain/products/types/products.model";
import { cn } from "@/utils/cn";
import { Eye, Heart, ShoppingBag } from "lucide-react";
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

      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-white/90"
          title={viewDetailsTitle}
        >
          <Eye size={18} aria-hidden />
        </Link>
        <Button
          onClick={onAddToCart}
          variant="ghost"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full p-0 shadow-lg active:scale-90",
            addToCartClassName,
          )}
          title={addToCartTitle}
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

      {showFavoriteButton ? (
        <Button
          onClick={onToggleFavorite}
          disabled={favoriteLoading}
          variant="ghost"
          className={cn(
            "absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full p-0 shadow-lg duration-300 active:scale-75",
            isFavorited
              ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-500"
              : "bg-surface/80 text-content/40 hover:bg-surface/80 shadow-black/5 backdrop-blur-md hover:text-red-500",
          )}
        >
          <Heart
            size={16}
            className={cn(
              "transition-transform",
              isFavorited && "fill-current",
            )}
          />
        </Button>
      ) : null}
    </div>
  );
}
