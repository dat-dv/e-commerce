export const HOMEPAGE_SECTION_TYPES = {
  FLASH_SALE: "flash_sale",
  CATEGORIES: "categories",
  PRODUCT_CAROUSEL: "product_carousel",
} as const;

export type HomepageSectionType =
  (typeof HOMEPAGE_SECTION_TYPES)[keyof typeof HOMEPAGE_SECTION_TYPES];
