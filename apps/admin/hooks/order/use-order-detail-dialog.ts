"use client";

import type { IOrderResponse } from "@ecommerce/shared";
import { useState } from "react";

export const useOrderDetailDialog = () => {
  const [selectedOrder, setSelectedOrder] = useState<IOrderResponse | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openOrderDetail = (order: IOrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const closeOrderDetail = () => {
    setIsDetailOpen(false);
  };

  return {
    selectedOrder,
    isDetailOpen,
    openOrderDetail,
    closeOrderDetail,
  };
};
