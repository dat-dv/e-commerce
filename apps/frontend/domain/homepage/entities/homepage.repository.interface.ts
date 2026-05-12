import { ApiResponse } from "@/utils/request/request.types";
import { IHomepageSection } from "../types/homepage.model";

export interface IHomepageRepository {
  getSections(): Promise<ApiResponse<IHomepageSection[]>>;
}
