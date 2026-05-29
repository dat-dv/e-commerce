import axios, { AxiosError, AxiosResponse } from "axios";

import { ENV } from "@/config/env";

import { CustomAxiosInstance } from "./api-client.types";
import { requestInterceptor } from "./interceptors/request";
import {
  errorResponseInterceptor,
  successResponseInterceptor,
} from "./interceptors/response";

const instance = axios.create({
  baseURL: ENV.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error),
);

instance.interceptors.response.use(
  successResponseInterceptor as (response: AxiosResponse) => AxiosResponse,
  errorResponseInterceptor(instance) as (
    error: AxiosError,
  ) => Promise<AxiosResponse>,
);

export const apiClient = instance as unknown as CustomAxiosInstance;
