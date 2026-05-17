"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Lock, Eye, Shield, KeyRound, LockKeyhole } from "lucide-react";
import AppContainer from "@/components/atoms/app-container";

interface PrivacyHeaderProps {
  isVi: boolean;
}

export function PrivacyHeader({
  isVi,
}: PrivacyHeaderProps): React.ReactElement {
  return (
    <div className="mb-6">
      <AppContainer>
        <AnimatedPageHeader
          title={isVi ? "CHÍNH SÁCH" : "PRIVACY"}
          highlight={isVi ? "BẢO MẬT" : "POLICY"}
          description={
            isVi
              ? "Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu riêng tư của bạn."
              : "We are committed to protecting your personal information and privacy data."
          }
          icons={[Lock, Eye, Shield, KeyRound, LockKeyhole]}
          center={true}
        />
      </AppContainer>
    </div>
  );
}

export default PrivacyHeader;
