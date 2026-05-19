"use client";

import React, { useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import TermsHeader from "./terms-header";
import TermsSidebar from "./terms-sidebar";
import TermsContent from "./terms-content";
import { useTranslations } from "next-intl";

interface StaticPageSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export function TermsView(): React.ReactElement {
  const t = useTranslations("Terms");
  const rawSections = t.raw("sections") as StaticPageSection[];

  const sidebarSections = useMemo(() => {
    return rawSections.map((section) => ({
      id: section.id,
      title: section.title,
    }));
  }, [rawSections]);

  return (
    <SidebarLayout
      header={<TermsHeader />}
      sidebar={<TermsSidebar sections={sidebarSections} />}
    >
      <TermsContent sections={rawSections} />
    </SidebarLayout>
  );
}

export default TermsView;
