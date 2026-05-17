"use client";

import React, { useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import PrivacyHeader from "./privacy-header";
import PrivacySidebar from "./privacy-sidebar";
import PrivacyContent from "./privacy-content";

interface StaticPageSection {
  id: string;
  title: string;
  paragraphs: string[];
}

interface StaticPageData {
  title: string;
  description: string;
  sections: StaticPageSection[];
}

interface PrivacyViewProps {
  data: StaticPageData;
  lang: "en" | "vi";
}

export function PrivacyView({
  data,
  lang,
}: PrivacyViewProps): React.ReactElement {
  const sections = useMemo(() => {
    return data.sections.map((section) => ({
      id: section.id,
      title: section.title,
    }));
  }, [data.sections]);

  return (
    <SidebarLayout
      header={
        <PrivacyHeader title={data.title} description={data.description} />
      }
      sidebar={<PrivacySidebar sections={sections} lang={lang} />}
    >
      <PrivacyContent sections={data.sections} lang={lang} />
    </SidebarLayout>
  );
}

export default PrivacyView;
