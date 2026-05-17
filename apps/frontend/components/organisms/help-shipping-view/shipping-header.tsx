"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Truck, Package, MapPin, Clock, Compass } from "lucide-react";
import AppContainer from "@/components/atoms/app-container";

export function ShippingHeader(): React.ReactElement {
  return (
    <AppContainer>
      <AnimatedPageHeader
        title="SHIPPING"
        highlight="INFORMATION"
        description="Find answers to questions about shipping, couriers, and delivery tracking policies."
        icons={[Truck, Package, MapPin, Clock, Compass]}
      />
    </AppContainer>
  );
}

export default ShippingHeader;
