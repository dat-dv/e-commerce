import {
  ApiErrorResponse,
  ApiResponse,
  ErrorResponseType,
  JsonValue,
  ResponseType,
} from "./request.types";

type ResponsePayload = ApiResponse<JsonValue> | Blob | ArrayBuffer | string;
type ApiErrorPayload = ApiErrorResponse & { error?: string };

export const successResponseStrategies: Record<
  ResponseType,
  (res: Response) => Promise<ResponsePayload>
> = {
  blob: (res) => res.blob(),
  arrayBuffer: (res) => res.arrayBuffer(),
  text: (res) => res.text(),
  json: async (res) => {
    return (await res.json()) as ApiResponse<JsonValue>;
  },
};

export const errorResponseStrategies: Record<
  ErrorResponseType,
  (res: Response) => Promise<ApiErrorResponse>
> = {
  json: async (res) => {
    const json = (await res.json()) as ApiErrorPayload;

    return {
      message: json.message || json.error || "Request failed",
      code: json.code,
      errors: json.errors,
    };
  },

  other: async (res) => {
    const text = await res.text();
    return { message: text };
  },
};
