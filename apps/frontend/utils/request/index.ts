import { forwardClientRequest } from "./forward-request";
import { IRequestOptions, RequestBody, TRequest } from "./request.types";

export const appRequest: TRequest = {
  get: <T>(url: string, options?: IRequestOptions) =>
    forwardClientRequest<T>("GET", url, undefined, options),

  post: <T, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => forwardClientRequest<T>("POST", url, body, options),

  put: <T, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => forwardClientRequest<T>("PUT", url, body, options),

  patch: <T, TBody extends RequestBody = RequestBody>(
    url: string,
    body?: TBody,
    options?: IRequestOptions,
  ) => forwardClientRequest<T>("PATCH", url, body, options),

  delete: <T>(url: string, options?: IRequestOptions) =>
    forwardClientRequest<T>("DELETE", url, undefined, options),
};
