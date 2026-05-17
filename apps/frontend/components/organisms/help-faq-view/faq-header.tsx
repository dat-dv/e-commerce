"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  HelpCircle,
  ShieldAlert,
  CreditCard,
  Ship,
  Keyboard,
} from "lucide-react";
import AppContainer from "@/components/atoms/app-container";

export function FAQHeader(): React.ReactElement {
  return (
    <AppContainer>
      <AnimatedPageHeader
        title="FREQUENTLY"
        highlight="ASKED QUESTIONS"
        description="Find answers to common questions about using Shop.Hub, account safety, and payment processing."
        icons={[HelpCircle, ShieldAlert, CreditCard, Ship, Keyboard]}
      />
    </AppContainer>
  );
}

export default FAQHeader;
