"use client";

import React, { useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import { useConfig } from "@/hooks/config/use-config";
import PrivacyHeader from "./privacy-header";
import PrivacySidebar from "./privacy-sidebar";
import PrivacyContent from "./privacy-content";

const SECTIONS_EN = [
  { id: "introduction", title: "1. Introduction" },
  { id: "when-collect", title: "2. When will we collect data?" },
  { id: "what-collect", title: "3. What data will we collect?" },
];

const SECTIONS_VI = [
  { id: "introduction", title: "1. Giới thiệu" },
  { id: "when-collect", title: "2. Khi nào thu thập dữ liệu?" },
  { id: "what-collect", title: "3. Dữ liệu nào được thu thập?" },
];

export function PrivacyView(): React.ReactElement {
  const { language } = useConfig();
  const isVi = language === "vi";

  const sections = useMemo(() => {
    return isVi ? SECTIONS_VI : SECTIONS_EN;
  }, [isVi]);

  return (
    <SidebarLayout
      header={<PrivacyHeader isVi={isVi} />}
      sidebar={<PrivacySidebar sections={sections} isVi={isVi} />}
    >
      <PrivacyContent isVi={isVi} />
    </SidebarLayout>
  );
}

export default PrivacyView;
