import type { Metadata } from "next";
import TermsView from "@/components/organisms/terms-view";
import termsData from "../terms.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: "vi" | "en" }>;
}) {
  const { locale } = await params;
  const data = termsData[locale];

  return <TermsView data={data} lang={locale} />;
}
