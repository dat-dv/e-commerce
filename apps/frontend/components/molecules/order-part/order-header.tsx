"use client";

import { AnimatedPageHeader } from "@ecommerce/ui";
import { PackageCheck, Receipt, ShoppingBag, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export const OrderHeader = () => {
  const t = useTranslations("OrdersPage.header");

  return (
    <AnimatedPageHeader
      title={t("title")}
      highlight={t("highlight")}
      description={t("description")}
      icons={[PackageCheck, ShoppingBag, Truck, Receipt]}
    />
  );
};
