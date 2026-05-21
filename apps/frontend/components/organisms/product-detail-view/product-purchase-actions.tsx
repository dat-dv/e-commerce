"use client";

import Button from "@/components/atoms/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductPurchaseActionsProps {
  hasSelectedSku: boolean;
  isFavorited: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleFavorite?: () => void;
}

export function ProductPurchaseActions({
  hasSelectedSku,
  isFavorited,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
}: ProductPurchaseActionsProps) {
  const t = useTranslations("ProductDetailPage");

  return (
    <div className="mt-2 flex gap-4">
      <Button
        variant="outline"
        className="bg-primary/10 hover:bg-primary/20 border-primary/20 h-auto flex-1 py-3.5 hover:brightness-100"
        onClick={onAddToCart}
        disabled={!hasSelectedSku}
      >
        <ShoppingCart size={18} />
        {t("addToCart")}
      </Button>
      <Button
        variant="primary"
        className="h-auto flex-1 py-3.5"
        onClick={onBuyNow}
        disabled={!hasSelectedSku}
      >
        {t("buyNow")}
      </Button>
      <Button
        variant="ghost"
        className={`flex h-12 w-12 items-center justify-center rounded-xl border px-0 transition-all ${
          isFavorited
            ? "border-red-100 bg-red-50 text-red-500 shadow-sm shadow-red-500/10"
            : "bg-content/[0.02] border-content/[0.08] text-content/40 hover:border-red-100 hover:bg-red-50/30 hover:text-red-400"
        }`}
        onClick={onToggleFavorite}
      >
        <Heart
          size={20}
          fill={isFavorited ? "currentColor" : "none"}
          className={isFavorited ? "animate-pulse-slow" : ""}
        />
      </Button>
    </div>
  );
}
