import { AdminFlashSalesView } from "@/components/organisms/admin-flash-sales-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("AdminFlashSalesPage.header");
  return {
    title: `${t("title")} | Chốt Đơn`,
    description: t("description"),
  };
}

export default function AdminFlashSalesPage() {
  return <AdminFlashSalesView />;
}
