export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginationData<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type PaginationParams = {
  page: number;
  limit: number;
  search: string;
};

export type PaginationExtraParams = Record<
  string,
  string | number | boolean | null | undefined | object
>;

export type PaginationQueryParams = PaginationParams & PaginationExtraParams;

export type PaginatedResponse<T> = {
  data: PaginationData<T>;
};

export type PaginationFetchMode = "append" | "replace";

export type UsePaginationCoreParams<
  T,
  TParams extends PaginationQueryParams = PaginationParams,
> = {
  initialData: PaginationData<T> | null;
  fetchPage: (params: Partial<TParams>) => Promise<PaginatedResponse<T>>;
};
