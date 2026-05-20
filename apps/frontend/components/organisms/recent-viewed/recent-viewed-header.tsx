"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Clock, Eye, History, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

const RECENT_VIEWED_ICONS = [Eye, History, Clock, ShoppingBag];

export const RecentViewedHeader = () => {
  const t = useTranslations("RecentViewedPage");

  return (
    <AnimatedPageHeader
      title={t("title")}
      description={t("description")}
      icons={RECENT_VIEWED_ICONS}
    />
  );
};

export default RecentViewedHeader;
