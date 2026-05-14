import { APP_ROUTES } from "@/constants/routes";
import { HOMEPAGE_SECTION_TYPES } from "@/constants/homepage";

export const getSectionHref = (type: string, slug?: string): string => {
  if (slug) {
    return APP_ROUTES.CATEGORY_DETAIL(slug);
  }

  switch (type) {
    case HOMEPAGE_SECTION_TYPES.FLASH_SALE:
      return APP_ROUTES.FLASH_SALE;
    case HOMEPAGE_SECTION_TYPES.RECOMMENDS:
    case HOMEPAGE_SECTION_TYPES.RECENT_VIEW:
    default:
      return APP_ROUTES.PRODUCTS;
  }
};
