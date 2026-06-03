import type { IAdminLanguage } from "./language.model";

export interface IAdminLanguageRepository {
  getLanguages(): Promise<IAdminLanguage[]>;
}
