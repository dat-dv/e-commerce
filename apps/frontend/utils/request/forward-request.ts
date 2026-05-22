import { APP_ROUTES } from "@/constants/routes";
import { getRequestOptionsForClientOrServer } from "./get-request-options";
import processRequest, { RequestError } from "./process-request";
import { refreshToken } from "./refresh-token";
import { ApiResponse, IRequestOptions, RequestBody } from "./request.types";

let refreshPromise: Promise<void> | null = null;

export const forwardClientRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  body?: RequestBody,
  options?: IRequestOptions,
): Promise<ApiResponse<T>> => {
  const [fullUrl, extendOptions] = await getRequestOptionsForClientOrServer({
    url,
    body,
    options,
    method,
  });

  return processRequest<T>(fullUrl.toString(), extendOptions).catch((error) => {
    const isServer = typeof window === "undefined";
    if (
      isServer ||
      !(error instanceof RequestError) ||
      error.status !== 401 ||
      options?.skipAutoRefresh
    ) {
      throw error;
    }

    // Tất cả request 401 cùng chờ 1 promise duy nhất
    refreshPromise ??= refreshToken()
      .then((response) => {
        if (!response.ok) throw new Error("Refresh failed");
      })
      .catch((err) => {
        window.location.href = APP_ROUTES.SIGN_IN;
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise.then(() =>
      forwardClientRequest<T>(method, url, body, {
        ...options,
        skipAutoRefresh: true,
      }),
    );
  });
};
