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
        "relative aspect-square overflow-hidden bg-transparent flex items-center justify-center",
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

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <Link
          href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
          className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-all"
          title={viewDetailsTitle}
        >
          <Eye size={18} aria-hidden />
        </Link>
        <Button
          onClick={onAddToCart}
          variant="ghost"
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 p-0",
            addToCartClassName,
          )}
          title={addToCartTitle}
        >
          <ShoppingBag size={18} aria-hidden />
        </Button>
      </div>

      {badges ? (
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
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
            "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center duration-300 z-10 shadow-lg active:scale-75 p-0",
            isFavorited
              ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-500"
              : "bg-surface/80 backdrop-blur-md text-content/40 hover:text-red-500 hover:bg-surface/80 shadow-black/5",
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
