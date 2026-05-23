import { IRequestOptions, Method, RequestBody } from "../request.types";

export type GetRequestOptionsParams = {
  url: string;
  body?: RequestBody;
  options?: IRequestOptions;
  method: Method;
};

export type RequestOptionsResult = Parameters<typeof fetch>;
