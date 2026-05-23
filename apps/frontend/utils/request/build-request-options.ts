import z from "zod";
import {
  GetRequestOptionsParams,
  RequestOptionsResult,
} from "./get-request-options.types";

export const buildRequestOptions = ({
  baseUrl,
  url,
  headers,
  body,
  options,
  method,
}: GetRequestOptionsParams & {
  baseUrl: string;
  headers: Record<string, string>;
}): RequestOptionsResult => {
  const isFormData = body instanceof FormData;
  const parsedUrl = new URL(`${baseUrl}${url}`);

  Object.entries(options?.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      parsedUrl.searchParams.append(key, String(value));
    }
  });

  const fullUrl = z.url().parse(parsedUrl.toString());

  return [
    fullUrl,
    {
      method,
      credentials: "include",
      ...options,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    },
  ];
};
