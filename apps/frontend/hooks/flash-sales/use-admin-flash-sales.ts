"use client";

import { toast } from "@ecommerce/ui";
import { flashSalesUseCase } from "@/domain/flash-sales";
import type {
  TAddProductsToFlashSaleInput,
  TCreateFlashSaleInput,
  TCreateTimeSlotInput,
  TFlashSale,
  TFlashSaleTimeSlot,
} from "@/domain/flash-sales/types/flash-sale.model";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAdminFlashSales() {
  const t = useTranslations("AdminFlashSalesPage.feedback");
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

  const createTimeSlot = useCallback(
    async (input: TCreateTimeSlotInput) => {
      setLoading(true);

      try {
        const response = await flashSalesUseCase.createTimeSlot.execute(input);

        if (response.status !== "success") {
          toast.error(t("createTimeSlotError"));
          return false;
        }

        toast.success(t("createTimeSlotSuccess"));
        refresh();
        return true;
      } catch {
        toast.error(t("createTimeSlotError"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh, t],
  );

  const createFlashSale = useCallback(
    async (input: TCreateFlashSaleInput) => {
      setLoading(true);

      try {
        const response = await flashSalesUseCase.createFlashSale.execute(input);

        if (response.status !== "success") {
          toast.error(t("createCampaignError"));
          return false;
        }

        toast.success(t("createCampaignSuccess"));
        refresh();
        return true;
      } catch {
        toast.error(t("createCampaignError"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh, t],
  );

  const addProductsToFlashSale = useCallback(
    async (id: string, input: TAddProductsToFlashSaleInput) => {
      setLoading(true);

      try {
        const response = await flashSalesUseCase.addProductsToFlashSale.execute(
          id,
          input,
        );

        if (response.status !== "success") {
          toast.error(t("attachProductsError"));
          return false;
        }

        toast.success(t("attachProductsSuccess"));
        refresh();
        return true;
      } catch {
        toast.error(t("attachProductsError"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh, t],
  );

  return {
    flashSales,
    timeSlots,
    loading,
    hasError,
    refresh,
    createTimeSlot,
    createFlashSale,
    addProductsToFlashSale,
  };
}
