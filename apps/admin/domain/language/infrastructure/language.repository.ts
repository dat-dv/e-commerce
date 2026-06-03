import type { IApiResponse, ILanguageListResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminLanguage } from "../types/language.model";
import type { IAdminLanguageRepository } from "../types/language.repository";

export class AdminLanguageRepository implements IAdminLanguageRepository {
  async getLanguages(): Promise<IAdminLanguage[]> {
    const response = await apiClient.get<IApiResponse<ILanguageListResponse>>(
      API_ROUTES.LANGUAGES.LIST,
    );

    return (response.data ?? []).map((language) => ({
      id: language.id,
      code: language.code,
      name: language.name,
    }));
  }
}
