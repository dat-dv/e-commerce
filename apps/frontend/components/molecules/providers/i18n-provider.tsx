"use client";

import { I18nProvider } from "react-aria-components/I18nProvider";

export function I18nProviderClient({
  language,
  children,
}: {
  language: string;
  children: React.ReactNode;
}) {
  return <I18nProvider locale={language}>{children}</I18nProvider>;
}
