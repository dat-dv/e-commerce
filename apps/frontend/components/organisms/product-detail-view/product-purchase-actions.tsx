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
    <div className="flex gap-4 mt-2">
      <Button
        variant="outline"
        className="flex-1 py-3.5 h-auto bg-primary/10 hover:bg-primary/20 border-primary/20 hover:brightness-100"
        onClick={onAddToCart}
        disabled={!hasSelectedSku}
      >
        <ShoppingCart size={18} />
        {t("addToCart")}
      </Button>
      <Button
        variant="primary"
        className="flex-1 py-3.5 h-auto"
        onClick={onBuyNow}
        disabled={!hasSelectedSku}
      >
        {t("buyNow")}
      </Button>
      <Button
        variant="ghost"
        className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all px-0 ${
          isFavorited
            ? "bg-red-50 border-red-100 text-red-500 shadow-sm shadow-red-500/10"
            : "bg-content/[0.02] border-content/[0.08] text-content/40 hover:text-red-400 hover:border-red-100 hover:bg-red-50/30"
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
