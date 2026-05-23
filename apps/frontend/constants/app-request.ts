import { createRequest } from "../utils/request/create-request";
import {
  IRequestOptions,
  RequestBody,
  TRequest,
} from "../utils/request/request.types";

export const appRequest: TRequest = {
  get: <T>(url: string, options?: IRequestOptions) =>
    createRequest<T>("GET", url, undefined, options),

  post: <T, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => createRequest<T>("POST", url, body, options),

  put: <T, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => createRequest<T>("PUT", url, body, options),

  patch: <T, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => createRequest<T>("PATCH", url, body, options),

  delete: <T>(url: string, options?: IRequestOptions) =>
    createRequest<T>("DELETE", url, undefined, options),
};
