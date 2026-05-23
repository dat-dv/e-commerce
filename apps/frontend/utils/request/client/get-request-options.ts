import { PUBLIC_ENV } from "@/config/public.env.config";
import { getSubdomainByHostname } from "../../sub-domain/get-client-sub-domain";
import { buildRequestOptions } from "../core/build-request-options";
import {
  GetRequestOptionsParams,
  RequestOptionsResult,
} from "../core/get-request-options.types";

export const getClientRequestOptions = (
  params: GetRequestOptionsParams,
): RequestOptionsResult => {
  const { body, options } = params;
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  headers["Accept-Language"] =
    headers["Accept-Language"] ?? getSubdomainByHostname();

  return buildRequestOptions({
    ...params,
    baseUrl: PUBLIC_ENV.NEXT_PUBLIC_API_URL,
    headers,
  });
};
