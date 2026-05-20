import { HelpShippingView } from "@/components/organisms/help-shipping-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "HelpCenter.shippingMetadata",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShippingPage() {
  return <HelpShippingView />;
}
