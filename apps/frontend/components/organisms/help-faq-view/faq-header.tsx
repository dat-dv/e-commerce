"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";
import { useAppConfig } from "@/hooks/config/use-config-store";
import {
  CreditCard,
  HelpCircle,
  Keyboard,
  ShieldAlert,
  Ship,
} from "lucide-react";

export function FAQHeader(): React.ReactElement {
  const language = useAppConfig((state) => state.language);
  const isVietnamese = language === "vi";

  return (
    <AppContainer>
      <AnimatedPageHeader
        title={isVietnamese ? "CÂU HỎI" : "FREQUENTLY"}
        highlight={isVietnamese ? "THƯỜNG GẶP" : "ASKED QUESTIONS"}
        description={
          isVietnamese
            ? "Tìm câu trả lời về Shop.Hub, an toàn tài khoản, thanh toán, giao hàng và đổi trả."
            : "Find answers to common questions about using Shop.Hub, account safety, and payment processing."
        }
        icons={[HelpCircle, ShieldAlert, CreditCard, Ship, Keyboard]}
        center
      />
    </AppContainer>
  );
}

export default FAQHeader;
