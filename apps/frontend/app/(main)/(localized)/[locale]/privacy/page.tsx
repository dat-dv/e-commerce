import type { Metadata } from "next";
import PrivacyView from "@/components/organisms/privacy-view";
import privacyData from "../../_data/privacy.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: "vi" | "en" }>;
}) {
  const { locale } = await params;
  const data = privacyData[locale];

  return <PrivacyView data={data} lang={locale} />;
}
