import type { IApiResponse, ILanguageListResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminLanguageRepository } from "../types/language.repository";

export class GetLanguagesUseCase extends UseCase<
  void,
  Promise<IApiResponse<ILanguageListResponse>>
> {
  constructor(private repository: IAdminLanguageRepository) {
    super();
  }

  async execute(): Promise<IApiResponse<ILanguageListResponse>> {
    return this.repository.getLanguages();
  }
}
