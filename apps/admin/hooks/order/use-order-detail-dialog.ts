"use client";

import { useState } from "react";

import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

export const useOrderDetailDialog = () => {
  const [selectedOrder, setSelectedOrder] =
    useState<IAdminCustomerOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openOrderDetail = (order: IAdminCustomerOrder) => {
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
