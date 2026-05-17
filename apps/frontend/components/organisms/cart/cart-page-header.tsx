"use client";

import {
  CreditCard,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";

const CART_HEADER_ICONS = [ShoppingBag, PackageCheck, CreditCard, ShieldCheck];

interface CartPageHeaderProps {
  itemCount: number;
}

export const CartPageHeader = ({ itemCount }: CartPageHeaderProps) => {
  const description =
    itemCount > 0
      ? `Review ${itemCount} item${itemCount > 1 ? "s" : ""}, select what you want to checkout, and keep your order ready in one place.`
      : "Your shopping bag is ready for the next item you discover.";

  return (
    <AnimatedPageHeader
      title="Shopping"
      highlight="Bag"
      description={description}
      icons={CART_HEADER_ICONS}
    />
  );
};
