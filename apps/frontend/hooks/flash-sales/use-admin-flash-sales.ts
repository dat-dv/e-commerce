"use client";

import { flashSalesUseCase } from "@/domain/flash-sales";
import type {
  TFlashSale,
  TFlashSaleTimeSlot,
} from "@/domain/flash-sales/types/flash-sale.model";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAdminFlashSales() {
  const [flashSales, setFlashSales] = useState<TFlashSale[]>([]);
  const [timeSlots, setTimeSlots] = useState<TFlashSaleTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const loadingRef = useRef(false);

  const fetchFlashSales = useCallback(async () => {
    if (loadingRef.current) return;

    setLoading(true);
    setHasError(false);
    loadingRef.current = true;

    try {
      const [flashSalesResponse, timeSlotsResponse] = await Promise.all([
        flashSalesUseCase.getFlashSales.execute(),
        flashSalesUseCase.getTimeSlots.execute(),
      ]);

      if (
        flashSalesResponse.status !== "success" ||
        timeSlotsResponse.status !== "success"
      ) {
        setHasError(true);
        return;
      }

      setFlashSales(flashSalesResponse.data || []);
      setTimeSlots(timeSlotsResponse.data || []);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFlashSales();
  }, [fetchFlashSales, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger((current) => current + 1);
  }, []);

  return {
    flashSales,
    timeSlots,
    loading,
    hasError,
    refresh,
  };
}
