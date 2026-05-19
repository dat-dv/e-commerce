"use client";

import { Zap, Timer, Flame, Sparkles } from "lucide-react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { useTranslations } from "next-intl";

export function FlashSaleHeader() {
  const t = useTranslations("FlashSalePage.header");

  return (
    <AnimatedPageHeader
      title={t("title")}
      highlight={t("highlight")}
      description={t("description")}
      icons={[Zap, Timer, Flame, Sparkles]}
    />
  );
}

export default FlashSaleHeader;
