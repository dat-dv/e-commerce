// ==== REQUEST =====
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };
export type RequestBody = BodyInit | JsonValue | object | null;

export interface IRequestOptions extends RequestInit {
  responseType?: ResponseType;
  skipAutoRefresh?: boolean;
  params?: Record<
    string,
    string | number | boolean | string[] | number[] | undefined
  >;
}

export interface IRequestParams {
  method: Method;
  url: string;
  body?: RequestBody;
  options?: IRequestOptions;
}

export type TRequestCreator = <T = JsonValue>(
  params: IRequestParams,
) => Promise<ApiResponse<T>>;

export type TRequest = {
  get: <T = JsonValue>(
    url: string,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  post: <T = JsonValue, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  put: <T = JsonValue, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  delete: <T = JsonValue>(
    url: string,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
  patch: <T = JsonValue, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => Promise<ApiResponse<T>>;
};

// ==== RESPONSE =====
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

export type ApiPaginatedResponse<T> = ApiResponse<ApiListResponse<T>>;

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ResponseType = "json" | "blob" | "arrayBuffer" | "text";
export type ErrorResponseType = "json" | "other";
