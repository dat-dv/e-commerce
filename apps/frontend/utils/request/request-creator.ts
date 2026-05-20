import {
  ApiErrorResponse,
  ApiResponse,
  ErrorResponseType,
  IRequestParams,
  ResponseType,
  TRequestCreator,
} from "./request.types";
import {
  errorResponseStrategies,
  successResponseStrategies,
} from "./response-mapping";

import { APP_ROUTES } from "@/constants/routes";
import { getSubdomainByHostname } from "@/utils/sub-domain/get-client-sub-domain";
import { refreshToken } from "./refresh-token";
import { processQueue, refreshState } from "./request-queue";

export class RequestError extends Error {
  constructor(
    public override message: string,
    public data?: ApiErrorResponse,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

function resolveResponseType(
  res: Response,
  responseType?: ResponseType,
): ResponseType {
  if (responseType) return responseType;
  const contentType = res.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? "json" : "blob";
}

const requestCreator: TRequestCreator = async <T>({
  method,
  url,
  body,
  options,
}: IRequestParams): Promise<ApiResponse<T>> => {
  // ===== QUEUE IF REFRESHING =====
  if (refreshState.isRefreshing && !options?.skipAutoRefresh) {
    return new Promise<ApiResponse<T>>((resolve, reject) => {
      refreshState.failedQueue.push({
        resolve: () => {
          requestCreator<T>({ method, url, body, options })
            .then(resolve)
            .catch(reject);
        },
        reject: (err) => reject(err),
      });
    });
  }

  const isFormData = body instanceof FormData;

  const res = await fetch(url, {
    method,
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      "Accept-Language": getSubdomainByHostname(),
      ...options?.headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // ===== REFRESH TOKEN =====
  const isServer = typeof window === "undefined";
  if (res.status === 401 && !options?.skipAutoRefresh && !isServer) {
    return new Promise<ApiResponse<T>>((resolve, reject) => {
      refreshState.failedQueue.push({
        resolve: () => {
          requestCreator<T>({ method, url, body, options })
            .then(resolve)
            .catch(reject);
        },
        reject: (err) => reject(err),
      });

      if (!refreshState.isRefreshing) {
        refreshState.isRefreshing = true;
        refreshToken()
          .then(() => {
            refreshState.isRefreshing = false;
            processQueue(null);
          })
          .catch((err) => {
            refreshState.isRefreshing = false;
            processQueue(
              err instanceof Error ? err : new Error("Refresh failed"),
            );
            window.location.replace(APP_ROUTES.SIGN_IN);
          });
      }
    });
  }

  // ===== ERROR =====
  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    const errorType: ErrorResponseType = contentType.includes(
      "application/json",
    )
      ? "json"
      : "other";
    const error = await errorResponseStrategies[errorType](res);

    throw new RequestError(error.message, error);
  }

  // ===== RESPONSE =====
  const type = resolveResponseType(res, options?.responseType);
  const data = await successResponseStrategies[type](res);

  return data as ApiResponse<T>;
};

export default requestCreator;
