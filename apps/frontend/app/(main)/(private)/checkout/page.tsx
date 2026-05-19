import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutView } from "@/components/organisms/checkout/checkout-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CheckoutPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CheckoutPage() {
  return <CheckoutView />;
}
