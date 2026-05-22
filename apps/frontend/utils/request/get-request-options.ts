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
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };
  const isFormData = body instanceof FormData;
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

  const fullUrl = z.url().parse(`${baseUrl}${url}`);

  return [
    fullUrl,
    {
      method,
      credentials: "include",
      ...options,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    },
  ];
};
