import {
  ApiErrorResponse,
  ApiResponse,
  IRequestOptions,
} from "../request.types";
import {
  errorResponseStrategies,
  resolveContentType,
  successResponseStrategies,
} from "./response-mapping";

export class RequestError extends Error {
  constructor(
    public override message: string,
    public status: number,
    public data?: ApiErrorResponse,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

const processRequest = async <T>(
  url: string,
  options?: IRequestOptions,
): Promise<ApiResponse<T>> => {
  const res = await fetch(url, options);
  const type = resolveContentType(res);

  // ===== ERROR =====
  if (!res.ok) {
    const error = await errorResponseStrategies[type](res);
    const errorInstance = new RequestError(error.message, res.status, error);
    throw errorInstance;
  }

  const getData = successResponseStrategies[type];
  const data = await getData(res);

  return data as ApiResponse<T>;
};

export default processRequest;
