import { IRequestOptions } from "../request.types";
import { RequestError } from "./process-request";

export const shouldRefresh = (error: unknown, options?: IRequestOptions) => {
  return (
    error instanceof RequestError &&
    error.status === 401 &&
    !options?.skipAutoRefresh
  );
};
