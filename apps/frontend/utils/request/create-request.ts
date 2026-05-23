import { createClientRequest } from "./client/create-client-request";
import {
  ApiResponse,
  IRequestOptions,
  Method,
  RequestBody,
} from "./request.types";
import { createServerRequest } from "./server/create-server-request";

export const createRequest = async <T>(
  method: Method,
  url: string,
  body?: RequestBody,
  options?: IRequestOptions,
): Promise<ApiResponse<T>> => {
  const createRuntimeRequest =
    typeof window === "undefined" ? createServerRequest : createClientRequest;

  return createRuntimeRequest<T>(method, url, body, options);
};
