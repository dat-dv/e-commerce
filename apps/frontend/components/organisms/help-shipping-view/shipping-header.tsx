"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";
import { useAppConfig } from "@/hooks/config/use-config-store";
import { Clock, Compass, MapPin, Package, Truck } from "lucide-react";

export function ShippingHeader(): React.ReactElement {
  const language = useAppConfig((state) => state.language);
  const isVietnamese = language === "vi";

  return (
    <AppContainer>
      <AnimatedPageHeader
        title={isVietnamese ? "THÔNG TIN" : "SHIPPING"}
        highlight={isVietnamese ? "GIAO HÀNG" : "INFORMATION"}
        description={
          isVietnamese
            ? "Tìm câu trả lời về vận chuyển, đơn vị giao hàng và chính sách theo dõi đơn."
            : "Find answers to questions about shipping, couriers, and delivery tracking policies."
        }
        icons={[Truck, Package, MapPin, Clock, Compass]}
        center
      />
    </AppContainer>
  );
}

export default ShippingHeader;
