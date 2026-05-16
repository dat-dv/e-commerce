"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { ShoppingBag, Package, Sparkles, Store } from "lucide-react";

interface ProductsHeaderProps {
  title?: string;
  description?: string;
}

const FLOATING_ICONS = [ShoppingBag, Package, Sparkles, Store];

export function ProductsHeader({
  title = "Our",
  description = "Explore our curated collection of premium products.",
}: ProductsHeaderProps) {
  return (
    <AnimatedPageHeader
      title={title}
      highlight="Products"
      description={description}
      icons={FLOATING_ICONS}
    />
  );
}

export default ProductsHeader;
