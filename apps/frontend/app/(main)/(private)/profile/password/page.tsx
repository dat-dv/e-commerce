import React from "react";
import { PasswordView } from "@/components/organisms/password-view";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePasswordPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ChangePasswordPage() {
  return <PasswordView />;
}
