import { IPaginationMeta } from "@/utils/request/request.types";

export const PAGINATION_LIMITS = {
  DEFAULT: 15,
  FAVORITES: 24,
  RECENT_VIEWED: 15,
  RECOMMENDED: 15,
} as const;

export const createInitialPaginationMeta = (
  limit: number = PAGINATION_LIMITS.DEFAULT,
): IPaginationMeta => ({
  total: 0,
  page: 0,
  limit,
  totalPages: 1,
});
