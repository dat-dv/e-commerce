import { APP_ROUTES } from "@/constants/routes";
import { HOMEPAGE_SECTION_TYPES } from "@/constants/homepage";

export const getSectionHref = (type: string, slug?: string): string => {
  if (slug) {
    return APP_ROUTES.CATEGORY_DETAIL(slug);
  }

  switch (type) {
    case HOMEPAGE_SECTION_TYPES.FLASH_SALE:
      return APP_ROUTES.FLASH_SALE;
    default:
      return APP_ROUTES.PRODUCTS;
  }
};
