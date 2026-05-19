"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";
import { useTranslations } from "next-intl";
import { Clock, Compass, MapPin, Package, Truck } from "lucide-react";

export function ShippingHeader(): React.ReactElement {
  const t = useTranslations("HelpCenter.headers.shipping");

  return (
    <AppContainer>
      <AnimatedPageHeader
        title={t("title")}
        highlight={t("highlight")}
        description={t("description")}
        icons={[Truck, Package, MapPin, Clock, Compass]}
        center
      />
    </AppContainer>
  );
}

export default ShippingHeader;
