import { useTranslations } from "next-intl";

type Translator = ReturnType<typeof useTranslations>;

export const dummyTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
  markup: (key: string) => key,
  raw: (key: string) => key,
  has: () => true,
}) as unknown as Translator;

export const getRawI18nValue = <T>(translator: unknown) => {
  return translator as unknown as T;
};
