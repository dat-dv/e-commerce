import processRequest from "../core/process-request";
import { ProcessRequestParams } from "../core/request-processor.types";

export async function processServerRequest<T>({
  fullUrl,
  extendOptions,
}: ProcessRequestParams) {
  return processRequest<T>(fullUrl, extendOptions);
}
