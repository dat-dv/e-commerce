"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Ticket, Tags, Gift, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export const VoucherHeader = () => {
  const t = useTranslations("VouchersPage.header");

  return (
    <AnimatedPageHeader
      title={t("title")}
      highlight={t("highlight")}
      description={t("description")}
      icons={[Ticket, Tags, Gift, Sparkles]}
    />
  );
};

export default VoucherHeader;
