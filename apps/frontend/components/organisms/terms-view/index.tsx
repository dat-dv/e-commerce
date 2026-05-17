"use client";

import React, { useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import TermsHeader from "./terms-header";
import TermsSidebar from "./terms-sidebar";
import TermsContent from "./terms-content";

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

interface TermsViewProps {
  data: StaticPageData;
  lang: "en" | "vi";
}

export function TermsView({ data, lang }: TermsViewProps): React.ReactElement {
  const sections = useMemo(() => {
    return data.sections.map((section) => ({
      id: section.id,
      title: section.title,
    }));
  }, [data.sections]);

  return (
    <SidebarLayout
      header={<TermsHeader title={data.title} description={data.description} />}
      sidebar={<TermsSidebar sections={sections} lang={lang} />}
    >
      <TermsContent sections={data.sections} lang={lang} />
    </SidebarLayout>
  );
}

export default TermsView;
