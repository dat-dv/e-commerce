"use client";

import Button from "@/components/atoms/button";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductMobilePurchaseBarProps {
  hasSelectedSku: boolean;
  isFavorited: boolean;
  price: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleFavorite?: () => void;
}

export function ProductMobilePurchaseBar({
  hasSelectedSku,
  isFavorited,
  price,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
}: ProductMobilePurchaseBarProps) {
  const a = useHeaderStore();
  const t = useTranslations("ProductDetailPage");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 26, stiffness: 230, delay: 0.3 }}
        className="fixed right-0 bottom-0 left-0 z-50"
      >
        <div className="border-content/10 bg-surface/90 pb-safe border-t px-4 pt-3 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <div className="flex items-center gap-3 pb-4">
            <Button
              variant="ghost"
              onClick={onToggleFavorite}
              className={`size-12 shrink-0 rounded-xl border px-0 transition-all ${
                isFavorited
                  ? "border-red-100 bg-red-50 text-red-500 shadow-sm shadow-red-500/10"
                  : "border-content/[0.08] bg-content/[0.02] text-content/40 hover:border-red-100 hover:bg-red-50/30 hover:text-red-400"
              }`}
            >
              <Heart
                size={20}
                fill={isFavorited ? "currentColor" : "none"}
                className={isFavorited ? "animate-pulse-slow" : ""}
              />
            </Button>

            <Button
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20 border-primary/20 h-12 flex-1 hover:brightness-100"
              onClick={onAddToCart}
              disabled={!hasSelectedSku}
            >
              <ShoppingCart size={17} />
              {t("addToCart")}
            </Button>

            <Button
              variant="primary"
              className="h-12 flex-1"
              onClick={onBuyNow}
              disabled={!hasSelectedSku}
            >
              {t("buyNow")}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
