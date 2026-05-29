"use client";

import { AnimatedPageHeader } from "@ecommerce/ui";
import { Flame, Sparkles, Timer, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export function FlashSaleHeader() {
  const t = useTranslations("FlashSalePage.header");

  return (
    <AnimatedPageHeader
      center
      title={t("title")}
      highlight={t("highlight")}
      description={t("description")}
      icons={[Zap, Timer, Flame, Sparkles]}
    />
  );
}

export default FlashSaleHeader;
