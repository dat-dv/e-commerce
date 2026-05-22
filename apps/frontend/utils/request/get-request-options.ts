import { PUBLIC_ENV } from "@/config/public.env.config";
import { SERVER_ENV } from "@/config/server.env.config";
import z from "zod";
import { getServerCookies } from "../cookies";
import { getSubdomainByHostname } from "../sub-domain/get-client-sub-domain";
import { getServerSubdomain } from "../sub-domain/get-server-sub-domain";
import { IRequestOptions, RequestBody } from "./request.types";

export const getRequestOptionsForClientOrServer = async ({
  url,
  body,
  options,
  method,
}: {
  url: string;
  body?: RequestBody;
  options?: IRequestOptions;
  method: string;
}): Promise<Parameters<typeof fetch>> => {
  const isServer = typeof window === "undefined";
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  let baseUrl = PUBLIC_ENV.NEXT_PUBLIC_API_URL;

  if (isServer) {
    try {
      baseUrl = SERVER_ENV.API_URL;
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

  const parsedUrl = new URL(`${baseUrl}${url}`);

  if (options?.params && typeof options.params === "object") {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        parsedUrl.searchParams.append(key, String(value));
      }
    });
  }

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
