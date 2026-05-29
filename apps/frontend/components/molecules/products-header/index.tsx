"use client";

import { AnimatedPageHeader } from "@ecommerce/ui";
import { ShoppingBag, Package, Sparkles, Store } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductsHeaderProps {
  title?: string;
  description?: string;
}

const FLOATING_ICONS = [ShoppingBag, Package, Sparkles, Store];

export function ProductsHeader({ title, description }: ProductsHeaderProps) {
  const t = useTranslations("Common.productsHeader");

  return (
    <AnimatedPageHeader
      title={title ?? t("title")}
      highlight={t("highlight")}
      description={description ?? t("description")}
      icons={FLOATING_ICONS}
    />
  );
}

export default ProductsHeader;
