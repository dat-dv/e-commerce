import type { Metadata } from "next";
import HelpShippingView from "@/components/organisms/help-shipping-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("HelpCenter.shippingMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ShippingPage() {
  return <HelpShippingView />;
}
