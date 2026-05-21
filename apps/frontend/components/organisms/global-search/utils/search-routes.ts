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
        APP_ROUTES.ALL_BRANDS,
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

  const optionBrands = {
    router: APP_ROUTES.ALL_BRANDS,
    placeholder: t("placeholderBrands"),
    label: t("optionBrands"),
  };

  const optionAll = {
    router: APP_ROUTES.SEARCH,
    placeholder: t("placeholderAll"),
    label: t("optionAll"),
  };

  const optionNewArrived = {
    router: APP_ROUTES.NEW_ARRIVALS,
    placeholder: t("placeholderNewArrived"),
    label: t("optionNewArrived"),
  };

  const options = isWithinPageSearchable(pathname)
    ? [
        optionWithinPage,
        optionFlashSale,
        optionBrands,
        optionNewArrived,
        optionAll,
      ]
    : [optionAll, optionFlashSale, optionBrands, optionNewArrived];

  return options.filter(
    (option, index, self) =>
      self.findIndex((item) => item.router === option.router) === index,
  );
};
