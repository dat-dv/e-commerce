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
import { PUBLIC_ENV } from "@/config/public.env.config";
import { API_ROUTES } from "@/constants/routes";

import { refreshState, processQueue } from "./request-queue";

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

// ===== CORE REQUEST =====
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
      ...options?.headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // ===== REFRESH TOKEN =====
  if (res.status === 401 && !options?.skipAutoRefresh) {
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

        requestCreator({
          method: "POST",
          url: `${PUBLIC_ENV.NEXT_PUBLIC_API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
          options: { skipAutoRefresh: true },
        })
          .then(() => {
            refreshState.isRefreshing = false;
            processQueue(null);
          })
          .catch((err) => {
            refreshState.isRefreshing = false;
            processQueue(err);
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
