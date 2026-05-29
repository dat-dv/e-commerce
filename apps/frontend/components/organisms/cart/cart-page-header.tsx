"use client";

import { AnimatedPageHeader } from "@ecommerce/ui";
import {
  CreditCard,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";

const CART_HEADER_ICONS = [ShoppingBag, PackageCheck, CreditCard, ShieldCheck];

interface CartPageHeaderProps {
  itemCount: number;
}

export const CartPageHeader = ({ itemCount }: CartPageHeaderProps) => {
  const t = useTranslations("CartPage.header");
  const description =
    itemCount > 0
      ? t("descriptionWithItems", { count: itemCount })
      : t("emptyDescription");

  return (
    <AnimatedPageHeader
      title={t("title")}
      highlight={t("highlight")}
      description={description}
      icons={CART_HEADER_ICONS}
    />
  );
};
