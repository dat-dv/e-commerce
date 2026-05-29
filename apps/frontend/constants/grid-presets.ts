import type { VirtualGridColumns } from "@ecommerce/ui";

export const PRODUCT_LISTING_GRID_CLASS_NAME =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export const PRODUCT_LISTING_GRID_COLUMNS = {
  base: 2,
  sm: 3,
  md: 4,
  lg: 5,
} satisfies VirtualGridColumns;

export const BRAND_LISTING_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export const BRAND_LISTING_GRID_COLUMNS = {
  base: 1,
  sm: 2,
  lg: 3,
  xl: 4,
} satisfies VirtualGridColumns;
