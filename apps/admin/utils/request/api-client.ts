import axios, { AxiosError, AxiosResponse } from "axios";

import { ENV } from "@/config/env";

import { requestInterceptor } from "./interceptors/request";
import {
  errorResponseInterceptor,
  successResponseInterceptor,
} from "./interceptors/response";

const apiClient = axios.create({
  baseURL: ENV.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error),
);

apiClient.interceptors.response.use(
  successResponseInterceptor as (response: AxiosResponse) => AxiosResponse,
  errorResponseInterceptor(apiClient) as (
    error: AxiosError,
  ) => Promise<AxiosResponse>,
);

export { apiClient };
