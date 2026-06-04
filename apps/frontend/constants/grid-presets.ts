import type { VirtualGridColumns } from "@ecommerce/ui";

export const PRODUCT_LISTING_GRID_CLASS_NAME =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4";

export const PRODUCT_LISTING_GRID_COLUMNS = {
  base: 2,
  sm: 3,
  md: 4,
} satisfies VirtualGridColumns;

export const PRODUCT_TWO_ROW_CAROUSEL_GRID_CLASS_NAME =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4";

export const PRODUCT_TWO_ROW_CAROUSEL_GRID_COLUMNS = {
  base: 2,
  sm: 3,
  md: 4,
} satisfies VirtualGridColumns;

export const PRODUCT_FILTER_LAYOUT_CLASS_NAME =
  "grid grid-cols-1 gap-8 lg:grid-cols-4";

export const BRAND_LISTING_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export const BRAND_LISTING_GRID_COLUMNS = {
  base: 1,
  sm: 2,
  lg: 3,
  xl: 4,
} satisfies VirtualGridColumns;

export const CATEGORY_GRID_CLASS_NAME = "grid grid-cols-2 gap-4 md:grid-cols-4";

export const REGION_GRID_CLASS_NAME = "grid grid-cols-2 gap-4 md:grid-cols-3";

export const FORM_TWO_COLUMN_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-4 sm:grid-cols-2";

export const PRODUCT_CAROUSEL_ITEM_CLASS =
  "grow-0 shrink-0 basis-[calc((100%_-_0.75rem)/2)] sm:basis-[calc((100%_-_2rem)/3)] md:basis-[calc((100%_-_3rem)/4)]";

export const CATEGORY_CAROUSEL_ITEM_CLASS =
  "flex-[0_0_68%] sm:flex-[0_0_45%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]";
