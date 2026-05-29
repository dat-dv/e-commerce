import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ApiErrorResponse, RequestError } from "../api-client.types";
import { handleRefreshToken } from "../refresh-token";

let refreshPromise: Promise<void> | null = null;

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function successResponseInterceptor(response: AxiosResponse): unknown {
  return response.data;
}

export function errorResponseInterceptor(instance: AxiosInstance) {
  return async (error: AxiosError<ApiErrorResponse>): Promise<unknown> => {
    const originalRequest = error.config as CustomRequestConfig;

    // Silent Token Rotation on 401 Unauthorized
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        // Singleton promise to prevent multiple concurrent refresh calls
        refreshPromise = handleRefreshToken(instance)
          .then(() => {
            refreshPromise = null;
          })
          .catch((refreshError) => {
            refreshPromise = null;
            if (typeof window !== "undefined") {
              window.location.href = "/sign-in";
            }
            const apiError = refreshError.response?.data;
            const message =
              apiError?.message || refreshError.message || "Session expired";
            const status = refreshError.response?.status || 401;
            throw new RequestError(message, status, apiError);
          });
      }

      return refreshPromise.then(() => instance(originalRequest));
    }

    // Standardize all error responses to throw RequestError
    const apiError = error.response?.data;
    const message = apiError?.message || error.message || "Request failed";
    const status = error.response?.status || 500;

    throw new RequestError(message, status, apiError);
  };
}
