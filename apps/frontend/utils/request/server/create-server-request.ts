import {
  ApiResponse,
  IRequestOptions,
  Method,
  RequestBody,
} from "../request.types";
import { getServerRequestOptions } from "./get-request-options";
import { processServerRequest } from "./process-server-request";

export const createServerRequest = async <T>(
  method: Method,
  url: string,
  body?: RequestBody,
  options?: IRequestOptions,
): Promise<ApiResponse<T>> => {
  const [fullUrl, extendOptions] = await getServerRequestOptions({
    url,
    body,
    options,
    method,
  });

  return processServerRequest<T>({
    method,
    url,
    fullUrl: fullUrl.toString(),
    body,
    options,
    extendOptions,
    retryRequest: createServerRequest,
  });
};
