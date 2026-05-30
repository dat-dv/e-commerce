import type { ApiPaginatedResponse } from "@/utils/request/request.types";
import type {
  PaginationData,
  PaginationParams,
  PaginationQueryParams,
} from "@ecommerce/ui";

export type UsePaginationParams<
  T,
  TParams extends PaginationQueryParams = PaginationParams,
> = {
  initialData: PaginationData<T> | null;
  extendParams?: Partial<TParams>;
  resetParams?: Partial<Omit<TParams, "page" | "limit">>;
  fetchPage: (params: Partial<TParams>) => Promise<ApiPaginatedResponse<T>>;
  isSyncWithSearchParams: boolean;
};

export type PaginationFilterChange<TParams extends PaginationQueryParams> = {
  key: Exclude<keyof TParams, "page" | "limit">;
  value: TParams[Exclude<keyof TParams, "page" | "limit">] | null;
};

export type PaginationFilterKey<TParams extends PaginationQueryParams> =
  Exclude<keyof TParams, "page" | "limit">;
