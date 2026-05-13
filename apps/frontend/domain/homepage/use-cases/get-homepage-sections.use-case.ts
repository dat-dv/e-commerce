import { ApiResponse } from "@/utils/request/request.types";
import { IHomepageRepository } from "../types/homepage.repository.interface";
import { THomepageSection } from "../types/homepage.model";

export class GetHomepageSectionsUseCase {
  constructor(private repository: IHomepageRepository) {}

  async execute(): Promise<ApiResponse<THomepageSection[]>> {
    return this.repository.getSections();
  }
}
