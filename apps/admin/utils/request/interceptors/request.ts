import { InternalAxiosRequestConfig } from "axios";

export function requestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone) {
    config.headers["timezone"] = timezone;
  }
  return config;
}
