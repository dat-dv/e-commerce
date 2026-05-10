import {
  ApiErrorResponse,
  ErrorResponseType,
  IRequestParams,
  ResponseType,
  TRequestCreator,
} from "./request.types";
import {
  errorResponseStrategies,
  successResponseStrategies,
} from "./response-mapping";

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
}: IRequestParams): Promise<T> => {
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

  return data as T;
};

export default requestCreator;
