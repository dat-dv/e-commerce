"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { TYPOGRAPHY } from "@/constants/typography";
import { Heart, Package, ShoppingBag, Sparkles } from "lucide-react";

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
        <div className="flex min-w-0 flex-col items-center md:items-end">
          <span className="text-2xl font-black tabular-nums text-content sm:text-3xl md:text-4xl">
            {count.toString().padStart(2, "0")}
          </span>

          <span
            className={`max-w-full truncate ${TYPOGRAPHY.caption} font-medium text-content/30`}
          >
            {t("banner.totalItems")}
          </span>
        </div>
      }
    />
  );
};

export default FavoritesBanner;
