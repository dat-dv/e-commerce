import { UseCase } from "@/utils/use-case";

import type { IAdminLanguage } from "../types/language.model";
import type { IAdminLanguageRepository } from "../types/language.repository";

export class GetLanguagesUseCase extends UseCase<
  void,
  Promise<IAdminLanguage[]>
> {
  constructor(private repository: IAdminLanguageRepository) {
    super();
  }

  async execute(): Promise<IAdminLanguage[]> {
    return this.repository.getLanguages();
  }
}
