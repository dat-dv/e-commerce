import { SERVER_ENV } from "@/config/server.env.config";
import { getServerCookies } from "../../cookies";
import { getServerSubdomain } from "../../sub-domain/get-server-sub-domain";
import { buildRequestOptions } from "../build-request-options";
import {
  GetRequestOptionsParams,
  RequestOptionsResult,
} from "../get-request-options.types";

export const getServerRequestOptions = async (
  params: GetRequestOptionsParams,
): Promise<RequestOptionsResult> => {
  const { body, options } = params;
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  try {
    const cookieStore = await getServerCookies();
    const cookieHeader = cookieStore?.toString();

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    headers["Accept-Language"] = await getServerSubdomain();
  } catch {
    // Not in a request context, skip cookie forwarding.
  }

  return buildRequestOptions({
    ...params,
    baseUrl: SERVER_ENV.API_URL,
    headers,
  });
};
