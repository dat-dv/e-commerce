import type { IApiResponse, ILanguageListResponse } from "@ecommerce/shared";

export interface IAdminLanguageRepository {
  getLanguages(): Promise<IApiResponse<ILanguageListResponse>>;
}
