import { useTranslations } from "next-intl";

type K = ReturnType<typeof useTranslations>;

/**
 * A type-safe mock translator that implements next-intl's full Translator interface.
 * Used to satisfy server-side/use-case Zod schemas that require a translation function
 * without requiring a running React context or next-intl provider.
 */
export const dummyTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
  markup: (key: string) => key,
  raw: (key: string) => key,
  has: () => true,
}) as unknown as K;
