import { PUBLIC_ENV } from "@/config/public.env.config";
import { SERVER_ENV } from "@/config/server.env.config";

import { getServerCookies } from "../cookies";
import { getSubdomainByHostname } from "../sub-domain/get-client-sub-domain";
import { getServerSubdomain } from "../sub-domain/get-server-sub-domain";
import requestCreator from "./request-creator";
import { ApiResponse, IRequestOptions, RequestBody } from "./request.types";

export const forwardClientRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  body?: RequestBody,
  options?: IRequestOptions,
): Promise<ApiResponse<T>> => {
  const isServer = typeof window === "undefined";
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };

  let baseUrl = PUBLIC_ENV.NEXT_PUBLIC_API_URL;

  if (isServer) {
    try {
      baseUrl = SERVER_ENV.API_URL || PUBLIC_ENV.NEXT_PUBLIC_API_URL;
      const cookieStore = await getServerCookies();
      const cookieHeader = cookieStore?.toString();
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }
      headers["Accept-Language"] = await getServerSubdomain();
    } catch {
      // Not in a request context, skip cookie forwarding
    }
  } else {
    headers["Accept-Language"] =
      headers["Accept-Language"] ?? getSubdomainByHostname();
  }

  let fullUrl = `${baseUrl}${url}`;

  if (options?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  return requestCreator<T>({
    method,
    url: fullUrl,
    body,
    options: {
      ...options,
      headers,
    },
  });
};
