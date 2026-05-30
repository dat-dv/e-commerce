import type { IApiResponse, ILanguageListResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminLanguageRepository } from "../types/language.repository";

export class AdminLanguageRepository implements IAdminLanguageRepository {
  async getLanguages(): Promise<IApiResponse<ILanguageListResponse>> {
    return apiClient.get<IApiResponse<ILanguageListResponse>>(
      API_ROUTES.LANGUAGES.LIST,
    );
  }
}
