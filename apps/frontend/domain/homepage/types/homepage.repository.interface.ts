import { ApiResponse } from "@/utils/request/request.types";
import { IGetHomepageSectionsRequest } from "@ecommerce/shared";
import { THomepageSection } from "./homepage.model";

export interface IHomepageRepository {
  getSections(
    query?: IGetHomepageSectionsRequest,
  ): Promise<ApiResponse<THomepageSection[]>>;
}
