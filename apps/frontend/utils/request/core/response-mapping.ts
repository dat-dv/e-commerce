import {
  ApiErrorResponse,
  ApiResponse,
  JsonValue,
  TResponseContent,
} from "../request.types";

type ResponsePayload = ApiResponse<JsonValue> | Blob | ArrayBuffer | string;
type ApiErrorPayload = ApiErrorResponse & { error?: string };

export function resolveContentType(res: Response): TResponseContent {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) return "json";
  if (contentType.includes("text/")) return "text";
  if (
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream") ||
    contentType.includes("image/")
  )
    return "blob";

  return "text"; // fallback: đọc raw string, an toàn hơn
}

export const successResponseStrategies: Record<
  TResponseContent,
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
  TResponseContent,
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

  text: async (res) => {
    const text = await res.text();
    return { message: text };
  },
  blob: async (res) => {
    // BE doesnt response this type fallback
    const text = await res.text();
    return { message: text };
  },
  arrayBuffer: async (res) => {
    // BE doesnt response this type fallback
    const text = await res.text();
    return { message: text };
  },
};
