import { ApiResponse } from "@/utils/request/request.types";
import { IGetHomepageSectionsRequest } from "@ecommerce/shared";
import { THomepageSection } from "../types/homepage.model";
import { IHomepageRepository } from "../types/homepage.repository.interface";

export class GetHomepageSectionsUseCase {
  constructor(private repository: IHomepageRepository) {}

  async execute(
    query?: IGetHomepageSectionsRequest,
  ): Promise<ApiResponse<THomepageSection[]>> {
    return this.repository.getSections(query);
  }
}
