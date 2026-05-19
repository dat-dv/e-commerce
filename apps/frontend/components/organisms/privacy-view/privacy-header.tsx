"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Lock, Eye, Shield, KeyRound, LockKeyhole } from "lucide-react";
import AppContainer from "@/components/atoms/app-container";
import { useTranslations } from "next-intl";

export function PrivacyHeader(): React.ReactElement {
  const t = useTranslations("Privacy");
  const title = t("title");
  const description = t("description");

  const words = title.split(" ");
  const isVi = title.toLowerCase().includes("chính");
  const highlight = isVi ? words.slice(-2).join(" ") : words.pop() || "";
  const mainTitle = isVi ? words.slice(0, -2).join(" ") : words.join(" ");

  return (
    <div className="mb-6">
      <AppContainer>
        <AnimatedPageHeader
          title={mainTitle}
          highlight={highlight}
          description={description}
          icons={[Lock, Eye, Shield, KeyRound, LockKeyhole]}
          center={true}
        />
      </AppContainer>
    </div>
  );
}

export default PrivacyHeader;
