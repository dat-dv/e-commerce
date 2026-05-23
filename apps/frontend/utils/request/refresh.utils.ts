import { RequestError } from "./process-request";
import { IRequestOptions } from "./request.types";

export const shouldRefresh = (error: unknown, options?: IRequestOptions) => {
  return (
    error instanceof RequestError &&
    error.status === 401 &&
    !options?.skipAutoRefresh
  );
};
