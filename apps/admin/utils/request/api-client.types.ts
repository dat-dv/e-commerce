import { AxiosRequestConfig } from "axios";

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  items: T[];
  meta: IPaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  meta?: IPaginationMeta;
  message?: string;
  timestamp?: string;
  status: "success" | "fail";
}

export interface ApiPaginatedResponse<T> {
  data: {
    items: T[];
    meta: IPaginationMeta;
  };
  message?: string;
  timestamp?: string;
  status: "success" | "fail";
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export class RequestError extends Error {
  constructor(
    public override message: string,
    public status: number,
    public data?: ApiErrorResponse,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export interface CustomAxiosInstance {
  request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
}
