import { ApiResponse } from "@/utils/request/request.types";
import { IHomepageRepository } from "../entities/homepage.repository.interface";
import { IHomepageSection } from "../types/homepage.model";

export class GetHomepageSectionsUseCase {
  constructor(private repository: IHomepageRepository) {}

  async execute(): Promise<ApiResponse<IHomepageSection[]>> {
    return this.repository.getSections();
  }
}
