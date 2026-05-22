import { IPaginationMeta } from "@/utils/request/request.types";

export const PAGINATION_LIMITS = {
  DEFAULT: 16,
  PRODUCTS: 24,
  FAVORITES: 24,
  CATEGORIES: 30,
  BRANDS: 24,
  NOTIFICATIONS: 15,
} as const;

export const createInitialPaginationMeta = (
  limit: number = PAGINATION_LIMITS.DEFAULT,
): IPaginationMeta => ({
  total: 0,
  page: 0,
  limit,
  totalPages: 1,
});
