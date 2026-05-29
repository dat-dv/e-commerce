"use client";

import { AppContainer } from "@ecommerce/ui";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Eye, KeyRound, Lock, LockKeyhole, Shield } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

export function PrivacyHeader(): React.ReactElement {
  const t = useTranslations("Privacy");
  const locale = useLocale();
  const title = t("title");
  const description = t("description");

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
          icons={[Lock, Eye, Shield, KeyRound, LockKeyhole]}
          center={true}
        />
      </AppContainer>
    </div>
  );
}

export default PrivacyHeader;
