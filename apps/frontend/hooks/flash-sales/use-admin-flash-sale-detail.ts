"use client";

import { toast } from "@ecommerce/ui";
import { flashSalesUseCase } from "@/domain/flash-sales";
import type {
  TAddProductsToFlashSaleInput,
  TFlashSale,
} from "@/domain/flash-sales/types/flash-sale.model";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAdminFlashSaleDetail(id: string) {
  const t = useTranslations("AdminFlashSalesPage.feedback");
  const [flashSale, setFlashSale] = useState<TFlashSale | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const loadingRef = useRef(false);

  const fetchDetail = useCallback(async () => {
    if (loadingRef.current) return;
    setLoading(true);
    setHasError(false);
    loadingRef.current = true;

    try {
      const response = await flashSalesUseCase.getFlashSales.execute();
      if (response.status !== "success") {
        setHasError(true);
        return;
      }
      const found = response.data?.find((fs) => fs.id === id);
      if (!found) {
        setHasError(true);
      } else {
        setFlashSale(found);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail();
  }, [fetchDetail, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger((current) => current + 1);
  }, []);

  const addProductsToFlashSale = useCallback(
    async (input: TAddProductsToFlashSaleInput) => {
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
    [id, refresh, t],
  );

  return {
    flashSale,
    loading,
    hasError,
    refresh,
    addProductsToFlashSale,
  };
}
