import { APP_ROUTES } from "@/constants/routes";
import processRequest from "../process-request";
import { shouldRefresh } from "../refresh.utils";
import { ProcessRequestParams } from "../request-processor.types";
import { refreshToken } from "./refresh-token";

let clientRefreshPromise: Promise<void> | null = null;

export async function processClientRequest<T>({
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
    if (!shouldRefresh(error, options)) {
      throw error;
    }

    // Tất cả request 401 cùng chờ 1 promise duy nhất
    clientRefreshPromise ??= refreshToken()
      .then((response) => {
        if (!response.ok) throw new Error("Refresh failed");
      })
      .catch((err) => {
        window.location.href = APP_ROUTES.SIGN_IN;
        throw err;
      })
      .finally(() => {
        clientRefreshPromise = null;
      });

    return clientRefreshPromise.then(() =>
      retryRequest<T>(method, url, body, {
        ...options,
        skipAutoRefresh: true,
      }),
    );
  }
}
