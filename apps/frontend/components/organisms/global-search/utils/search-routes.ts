import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

export interface SearchOption {
  router: string;
  placeholder: string;
  label: string;
}

export const isWithinPageSearchable = (path: string): boolean => {
  return (
    path.startsWith("/categories/") ||
    path.startsWith("/brands/") ||
    (
      [
        APP_ROUTES.PRODUCTS,
        APP_ROUTES.TOP_BRANDS,
        APP_ROUTES.NEW_ARRIVALS,
        APP_ROUTES.RECENTLY_VIEWED,
        APP_ROUTES.FAVORITES,
      ] as string[]
    ).includes(path)
  );
};

export const resolveDefaultRoute = (pathname: string): string => {
  if (isWithinPageSearchable(pathname)) {
    return pathname;
  }
  if (pathname === APP_ROUTES.FLASH_SALE) {
    return APP_ROUTES.FLASH_SALE;
  }
  return APP_ROUTES.SEARCH;
};

export const buildSearchOptions = (
  pathname: string,
  t: ReturnType<typeof useTranslations>,
): SearchOption[] => {
  const optionWithinPage = {
    router: pathname,
    placeholder: t("placeholderWithinPage"),
    label: t("optionWithinPage"),
  };

  const optionFlashSale = {
    router: APP_ROUTES.FLASH_SALE,
    placeholder: t("placeholderFlashSale"),
    label: t("optionFlashSale"),
  };

  const optionAll = {
    router: APP_ROUTES.SEARCH,
    placeholder: t("placeholderAll"),
    label: t("optionAll"),
  };

  return isWithinPageSearchable(pathname)
    ? [optionWithinPage, optionFlashSale, optionAll]
    : [optionAll, optionFlashSale];
};
