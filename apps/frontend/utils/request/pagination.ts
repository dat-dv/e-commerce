import { ApiListResponse } from "./request.types";

export const createEmptyPaginatedData = <T>(params?: {
  page?: number;
  limit?: number;
}): ApiListResponse<T> => ({
  items: [],
  meta: {
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 10,
    totalPages: 0,
  },
});

export const mapPaginatedData = <TInput, TOutput>(
  data: ApiListResponse<TInput> | undefined,
  mapper: (item: TInput) => TOutput,
  fallbackParams?: {
    page?: number;
    limit?: number;
  },
): ApiListResponse<TOutput> => {
  if (!data?.items || !data?.meta) {
    return createEmptyPaginatedData<TOutput>(fallbackParams);
  }

  return {
    items: data.items.map((item) => mapper(item)),
    meta: data.meta,
  };
};
