import {
  ApiResponse,
  IRequestOptions,
  Method,
  RequestBody,
} from "../request.types";
import { getClientRequestOptions } from "./get-request-options";
import { processClientRequest } from "./process-client-request";

export const createClientRequest = async <T>(
  method: Method,
  url: string,
  body?: RequestBody,
  options?: IRequestOptions,
): Promise<ApiResponse<T>> => {
  const [fullUrl, extendOptions] = await getClientRequestOptions({
    url,
    body,
    options,
    method,
  });

  return processClientRequest<T>({
    method,
    url,
    fullUrl: fullUrl.toString(),
    body,
    options,
    extendOptions,
    retryRequest: createClientRequest,
  });
};
