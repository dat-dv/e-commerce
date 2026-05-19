import React from "react";
import type { Metadata } from "next";
import { HelpContactView } from "@/components/organisms/help-contact-view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("HelpCenter.contactMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ContactPage() {
  return <HelpContactView />;
}
