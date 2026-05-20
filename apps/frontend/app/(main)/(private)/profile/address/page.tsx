import { AddressesView } from "@/components/organisms/addresses-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ProfileAddressesPage.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AddressesPage() {
  return <AddressesView />;
}
