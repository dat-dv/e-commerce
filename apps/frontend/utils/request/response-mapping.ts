import {
  ApiErrorResponse,
  ErrorResponseType,
  ResponseType,
} from "./request.types";

export const successResponseStrategies: Record<
  ResponseType,
  (res: Response) => Promise<unknown>
> = {
  blob: (res) => res.blob(),
  arrayBuffer: (res) => res.arrayBuffer(),
  text: (res) => res.text(),
  json: async (res) => {
    const json = await res.json();
    return json;
  },
};

export const errorResponseStrategies: Record<
  ErrorResponseType,
  (res: Response) => Promise<ApiErrorResponse>
> = {
  json: async (res) => {
    const json = (await res.json()) as {
      message?: string;
      error?: string;
    } & Record<string, unknown>;

    return {
      ...json,
      message: json.message || json.error || "Request failed",
    };
  },

  other: async (res) => {
    const text = await res.text();
    return { message: text };
  },
};
