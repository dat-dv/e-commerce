"use client";

import React, { useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import { useConfig } from "@/hooks/config/use-config";
import TermsHeader from "./terms-header";
import TermsSidebar from "./terms-sidebar";
import TermsContent from "./terms-content";

const SECTIONS_EN = [
  { id: "introduction", title: "1. Introduction" },
  { id: "privacy", title: "2. Privacy" },
  { id: "liability", title: "3. Limitation of Liability" },
];

const SECTIONS_VI = [
  { id: "introduction", title: "1. Giới thiệu" },
  { id: "privacy", title: "2. Quyền riêng tư" },
  { id: "liability", title: "3. Giới hạn trách nhiệm" },
];

export function TermsView(): React.ReactElement {
  const { language } = useConfig();
  const isVi = language === "vi";

  const sections = useMemo(() => {
    return isVi ? SECTIONS_VI : SECTIONS_EN;
  }, [isVi]);

  return (
    <SidebarLayout
      header={<TermsHeader isVi={isVi} />}
      sidebar={<TermsSidebar sections={sections} isVi={isVi} />}
    >
      <TermsContent isVi={isVi} />
    </SidebarLayout>
  );
}

export default TermsView;
