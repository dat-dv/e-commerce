"use client";

import { SearchInput } from "@/components/molecules/search-input";
import { useTranslations } from "next-intl";

interface NotificationFiltersProps {
  onSearch: (query: string) => void;
}

export const NotificationFilters = ({ onSearch }: NotificationFiltersProps) => {
  const t = useTranslations("NotificationsPage");

  return (
    <SearchInput
      value=""
      onSearch={onSearch}
      placeholder={t("filters.searchPlaceholder")}
      submitButtonLabel={t("filters.searchButton")}
      className="w-full bg-surface"
    />
  );
};
