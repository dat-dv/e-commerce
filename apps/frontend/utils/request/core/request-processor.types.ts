import {
  ApiResponse,
  IRequestOptions,
  Method,
  RequestBody,
} from "../request.types";

export type RetryRequest = <T>(
  method: Method,
  url: string,
  body?: RequestBody,
  options?: IRequestOptions,
) => Promise<ApiResponse<T>>;

export type ProcessRequestParams = {
  method: Method;
  url: string;
  fullUrl: string;
  body?: RequestBody;
  options?: IRequestOptions;
  extendOptions?: IRequestOptions;
  retryRequest: RetryRequest;
};

export type RuntimeRequestProcessor = <T>(
  params: ProcessRequestParams,
) => Promise<ApiResponse<T>>;
