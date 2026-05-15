export interface IApiResponse<T> {
  status: string;
  data: T;
  message: string | null;
  timestamp: string;
}

export interface IPaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
