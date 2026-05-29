"use client";

import React, { useMemo } from "react";
import { SidebarLayout } from "@ecommerce/ui";
import PrivacyHeader from "./privacy-header";
import PrivacySidebar from "./privacy-sidebar";
import PrivacyContent from "./privacy-content";
import { useTranslations } from "next-intl";

interface StaticPageSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export function PrivacyView(): React.ReactElement {
  const t = useTranslations("Privacy");
  const rawSections = t.raw("sections") as StaticPageSection[];

  const sidebarSections = useMemo(() => {
    return rawSections.map((section) => ({
      id: section.id,
      title: section.title,
    }));
  }, [rawSections]);

  return (
    <SidebarLayout
      header={<PrivacyHeader />}
      sidebar={<PrivacySidebar sections={sidebarSections} />}
    >
      <PrivacyContent sections={rawSections} />
    </SidebarLayout>
  );
}

export default PrivacyView;
