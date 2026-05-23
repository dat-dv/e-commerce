import processRequest, { RequestError } from "../process-request";
import { shouldRefresh } from "../refresh.utils";
import { ProcessRequestParams } from "../request-processor.types";
import { refreshToken } from "./refresh-token";

const serverRefreshPromises = new Map<string, Promise<string>>();

const getSetCookieHeaders = (headers: Headers) => {
  const headersWithGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookieHeaders = headersWithGetSetCookie.getSetCookie?.();
  if (setCookieHeaders?.length) return setCookieHeaders;

  const setCookieHeader = headers.get("set-cookie");
  return setCookieHeader?.split(/,(?=\s*[^;,=\s]+=[^;,]*)/) ?? [];
};

const toCookieHeader = (setCookieHeaders: string[]) =>
  setCookieHeaders
    .map((cookie) => cookie.split(";")[0])
    .filter(Boolean)
    .join("; ");

const mergeCookieHeaders = (...cookieHeaders: Array<string | undefined>) => {
  const cookies = new Map<string, string>();

  cookieHeaders.filter(Boolean).forEach((cookieHeader) => {
    cookieHeader?.split(";").forEach((cookie) => {
      const [name, ...valueParts] = cookie.trim().split("=");

      if (name && valueParts.length > 0) {
        cookies.set(name, valueParts.join("="));
      }
    });
  });

  return Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
};

export async function processServerRequest<T>({
  method,
  url,
  fullUrl,
  body,
  options,
  extendOptions,
  retryRequest,
}: ProcessRequestParams) {
  try {
    return await processRequest<T>(fullUrl, extendOptions);
  } catch (error) {
    if (!shouldRefresh(error, options) || !(error instanceof RequestError)) {
      throw error;
    }

    const requestCookieHeader = (
      extendOptions?.headers as Record<string, string> | undefined
    )?.Cookie;
    const refreshKey = requestCookieHeader ?? "";

    if (!serverRefreshPromises.has(refreshKey)) {
      const serverRefreshPromise = refreshToken()
        .then((response) => {
          if (!response.ok) throw error;

          const refreshCookieHeader = toCookieHeader(
            getSetCookieHeaders(response.headers),
          );

          if (!refreshCookieHeader) throw error;

          return mergeCookieHeaders(requestCookieHeader, refreshCookieHeader);
        })
        .finally(() => {
          serverRefreshPromises.delete(refreshKey);
        });

      serverRefreshPromises.set(refreshKey, serverRefreshPromise);
    }

    const cookieHeader = await serverRefreshPromises.get(refreshKey)!;

    return retryRequest<T>(method, url, body, {
      ...options,
      headers: {
        ...((options?.headers as Record<string, string>) || {}),
        Cookie: cookieHeader,
      },
      skipAutoRefresh: true,
    });
  }
}
