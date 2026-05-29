"use client";

import { AnimatedPageHeader } from "@ecommerce/ui";
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
          <span
            className={`${TYPOGRAPHY.pageTitle} text-content font-black tabular-nums`}
          >
            {count.toString().padStart(2, "0")}
          </span>

          <span
            className={`max-w-full truncate ${TYPOGRAPHY.caption} text-content/30 font-medium`}
          >
            {t("banner.totalItems")}
          </span>
        </div>
      }
    />
  );
};

export default FavoritesBanner;
