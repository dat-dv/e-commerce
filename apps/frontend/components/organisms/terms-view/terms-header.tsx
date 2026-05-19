"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  ShieldCheck,
  Scale,
  FileText,
  Handshake,
  BookOpen,
} from "lucide-react";
import AppContainer from "@/components/atoms/app-container";
import { useTranslations } from "next-intl";

export function TermsHeader(): React.ReactElement {
  const t = useTranslations("Terms");
  const title = t("title");
  const description = t("description");

  const words = title.split(" ");
  const isVi = title.toLowerCase().includes("điều");
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
