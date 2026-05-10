// ==== REQUEST =====
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IRequestOptions extends RequestInit {
  responseType?: ResponseType;
}

export interface IRequestParams {
  method: Method;
  url: string;
  body?: unknown;
  options?: IRequestOptions;
}

export type TRequestCreator = <T = unknown>(params: IRequestParams) => Promise<T>;

export type TRequest = {
  get: <T = unknown>(url: string, options?: IRequestOptions) => Promise<T>;
  post: <T = unknown>(url: string, body?: unknown, options?: IRequestOptions) => Promise<T>;
  put: <T = unknown>(url: string, body?: unknown, options?: IRequestOptions) => Promise<T>;
  delete: <T = unknown>(url: string, options?: IRequestOptions) => Promise<T>;
  patch: <T = unknown>(url: string, body?: unknown, options?: IRequestOptions) => Promise<T>;
};

// ==== RESPONSE =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
    requestId?: string;
    timestamp?: string;
  };
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ResponseType = 'json' | 'blob' | 'arrayBuffer' | 'text';
export type ErrorResponseType = 'json' | 'other';
