"use client";

import { AppConfig, NextIntlClientProvider } from "next-intl";
import React from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
  messages: AppConfig["Messages"];
}

export function I18nProviderClient({
  children,
  locale,
  messages,
}: I18nProviderClientProps) {
  return (
    <NextIntlClientProvider
      // fallback timezon to asia hcmc
      timeZone={"Asia/Ho_Chi_Minh"}
      locale={locale}
      messages={messages}
    >
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </NextIntlClientProvider>
  );
}
