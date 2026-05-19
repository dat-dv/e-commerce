import { Metadata } from "next";
import VoucherView from "@/components/organisms/vouchers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("VouchersPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function VouchersPage() {
  return <VoucherView />;
}
