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

interface TermsHeaderProps {
  isVi: boolean;
}

export function TermsHeader({ isVi }: TermsHeaderProps): React.ReactElement {
  return (
    <div className="mb-6">
      <AppContainer>
        <AnimatedPageHeader
          title={isVi ? "ĐIỀU KHOẢN" : "TERMS OF"}
          highlight={isVi ? "DỊCH VỤ" : "SERVICE"}
          description={
            isVi
              ? "Vui lòng đọc kỹ các điều khoản dịch vụ này trước khi sử dụng các tính năng và nền tảng của chúng tôi."
              : "Please read these terms of service carefully before using our features and platform."
          }
          icons={[ShieldCheck, Scale, FileText, Handshake, BookOpen]}
          center={true}
        />
      </AppContainer>
    </div>
  );
}

export default TermsHeader;
