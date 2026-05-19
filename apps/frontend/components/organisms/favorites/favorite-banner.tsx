"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Heart, Sparkles, ShoppingBag, Package } from "lucide-react";

import { useTranslations } from "next-intl";

const WISHLIST_ICONS = [Heart, Sparkles, ShoppingBag, Package];

const FavoritesBanner = ({ count }: { count: number }) => {
  const t = useTranslations("FavoritesPage");

  return (
    <AnimatedPageHeader
      title={t("banner.title")}
      highlight={t("banner.highlight")}
      description={t("banner.description")}
      icons={WISHLIST_ICONS}
      rightContent={
        <div className="flex flex-col items-center md:items-end">
          <span className="text-3xl md:text-4xl font-black text-content tabular-nums">
            {count.toString().padStart(2, "0")}
          </span>

          <span className="text-xs font-medium text-content/30">
            {t("banner.totalItems")}
          </span>
        </div>
      }
    />
  );
};

export default FavoritesBanner;
