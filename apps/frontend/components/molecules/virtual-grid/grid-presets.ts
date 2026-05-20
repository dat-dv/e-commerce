import type { VirtualGridColumns } from "./index";

export const PRODUCT_LISTING_GRID_CLASS_NAME =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export const PRODUCT_LISTING_GRID_COLUMNS = {
  base: 2,
  sm: 3,
  md: 4,
  lg: 5,
} satisfies VirtualGridColumns;

export const BRAND_LISTING_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-6 auto-rows-[240px] md:grid-cols-4 lg:grid-cols-5";

export const BRAND_LISTING_GRID_COLUMNS = {
  base: 1,
  md: 4,
  lg: 5,
} satisfies VirtualGridColumns;
