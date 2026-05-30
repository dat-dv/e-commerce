import { AdminLanguageRepository } from "./infrastructure/language.repository";
import { GetLanguagesUseCase } from "./use-cases/get-languages.use-case";

export * from "./infrastructure/language.repository";
export * from "./types/language.repository";
export * from "./use-cases/get-languages.use-case";

const languageRepository = new AdminLanguageRepository();

export const adminLanguageUseCase = {
  getLanguages: new GetLanguagesUseCase(languageRepository),
};
