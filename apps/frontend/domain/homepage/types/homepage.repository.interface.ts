import { ApiResponse } from "@/utils/request/request.types";
import { THomepageSection } from "./homepage.model";

export interface IHomepageRepository {
  getSections(): Promise<ApiResponse<THomepageSection[]>>;
}
