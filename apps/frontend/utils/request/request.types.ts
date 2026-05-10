// ==== REQUEST =====
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface IRequestOptions extends RequestInit {
  responseType?: ResponseType;
  skipAutoRefresh?: boolean;
}

export interface IRequestParams {
  method: Method;
  url: string;
  body?: unknown;
  options?: IRequestOptions;
}

export type TRequestCreator = <T = unknown>(
  params: IRequestParams,
) => Promise<ApiResponse<T>>;

export type TRequest = {
  get: <T = unknown>(
    url: string,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  post: <T = unknown>(
    url: string,
    body?: unknown,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  put: <T = unknown>(
    url: string,
    body?: unknown,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  delete: <T = unknown>(
    url: string,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  patch: <T = unknown>(
    url: string,
    body?: unknown,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
};

// ==== RESPONSE =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
  status: "success" | "fail";
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ResponseType = "json" | "blob" | "arrayBuffer" | "text";
export type ErrorResponseType = "json" | "other";
