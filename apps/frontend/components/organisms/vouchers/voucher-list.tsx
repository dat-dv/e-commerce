"use client";

import { Ticket } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import EmptyState from "@/components/molecules/empty-space";
import { useTranslations } from "next-intl";

export const VoucherList = () => {
  const t = useTranslations("VouchersPage.empty");

  return (
    <EmptyState
      title={t("title")}
      description={t("description")}
      icon={Ticket}
      actionLabel={t("action")}
      actionHref={APP_ROUTES.PRODUCTS}
    />
  );
};

export default VoucherList;
