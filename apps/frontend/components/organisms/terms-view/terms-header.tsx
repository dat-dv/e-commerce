"use client";

import AppContainer from "@/components/atoms/app-container";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  BookOpen,
  FileText,
  Handshake,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

export function TermsHeader(): React.ReactElement {
  const t = useTranslations("Terms");
  const title = t("title");
  const description = t("description");
  const locale = useLocale();

  const words = title.split(" ");
  const isVi = locale === "vi";
  const highlight = isVi ? words.slice(-2).join(" ") : words.pop() || "";
  const mainTitle = isVi ? words.slice(0, -2).join(" ") : words.join(" ");

  return (
    <div className="mb-6">
      <AppContainer>
        <AnimatedPageHeader
          title={mainTitle}
          highlight={highlight}
          description={description}
          icons={[ShieldCheck, Scale, FileText, Handshake, BookOpen]}
          center={true}
        />
      </AppContainer>
    </div>
  );
}

export default TermsHeader;
