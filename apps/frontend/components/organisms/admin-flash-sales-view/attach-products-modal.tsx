"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
  Button,
  XIcon,
} from "@ecommerce/ui";

import { AppForm } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormSelect } from "@ecommerce/ui";
import { FormSelectAutocomplete } from "@ecommerce/ui";
import {
  FORM_ACTION_ROW_CLASS_NAME,
  FORM_STACK_CLASS_NAME,
} from "@/constants/grid-presets";
import type {
  TAddProductsToFlashSaleInput,
  TFlashSale,
} from "@/domain/flash-sales/types/flash-sale.model";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  attachProductsSchema,
  type AttachProductsData,
} from "./attach-products.schema";

interface AttachProductsModalProps {
  isOpen: boolean;
  loading: boolean;
  flashSales: TFlashSale[];
  preselectedFlashSaleId?: string;
  onClose: () => void;
  onSubmit: (
    flashSaleId: string,
    input: TAddProductsToFlashSaleInput,
  ) => Promise<boolean>;
}

export function AttachProductsModal({
  isOpen,
  loading,
  flashSales,
  preselectedFlashSaleId,
  onClose,
  onSubmit,
}: AttachProductsModalProps) {
  const t = useTranslations("AdminFlashSalesPage.attachProductsForm");
  const tCommon = useTranslations("Common.modal");

  const [products, setProducts] = useState<TProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const defaultValues = useMemo(
    () => ({
      flashSaleId: preselectedFlashSaleId || "",
      productId: "",
      skuId: "",
      salePrice: 0,
      stock: 1,
      orderLimit: undefined,
    }),
    [preselectedFlashSaleId],
  );

  const methods = useForm<AttachProductsData>({
    resolver: zodResolver(attachProductsSchema),
    defaultValues,
  });

  const { control, setValue, reset } = methods;
  const selectedProductId = useWatch({ control, name: "productId" });
  const selectedSkuId = useWatch({ control, name: "skuId" });

  useEffect(() => {
    if (!isOpen) return;

    reset(defaultValues);
  }, [isOpen, reset, defaultValues]);

  useEffect(() => {
    if (!isOpen) return;
    if (productsLoaded) return;

    productsUseCase.getProducts
      .execute({ limit: 100 })
      .then((res) => {
        if (res.status === "success" && res.data?.items) {
          setProducts(res.data.items);
        }
      })
      .catch((err) => {
        console.error("Failed to load products for flash sale", err);
      })
      .finally(() => {
        setProductsLoaded(true);
      });
  }, [isOpen, productsLoaded]);

  const loadingProducts = isOpen && !productsLoaded;

  const flashSaleOptions = useMemo(() => {
    return flashSales.map((fs) => ({
      label: fs.name,
      value: fs.id,
    }));
  }, [flashSales]);

  const productOptions = useMemo(() => {
    return products.map((prod) => ({
      label: prod.name,
      value: prod.id,
    }));
  }, [products]);

  const selectedProduct = useMemo(() => {
    return products.find((prod) => prod.id === selectedProductId);
  }, [products, selectedProductId]);

  const skuOptions = useMemo(() => {
    if (!selectedProduct) return [];
    return selectedProduct.skus.map((sku) => {
      const attrs = sku.attributes
        ? sku.attributes.map((a) => `${a.name}: ${a.value}`).join(", ")
        : "";
      return {
        label: attrs || `SKU - ${sku.id.substring(0, 8)}`,
        value: sku.id,
      };
    });
  }, [selectedProduct]);

  const selectedSku = useMemo(() => {
    if (!selectedProduct || !selectedSkuId) return null;
    return selectedProduct.skus.find((sku) => sku.id === selectedSkuId);
  }, [selectedProduct, selectedSkuId]);

  useEffect(() => {
    if (selectedProductId) {
      setValue("skuId", "");
      setValue("salePrice", 0);
    }
  }, [selectedProductId, setValue]);

  useEffect(() => {
    if (selectedSkuId && selectedProduct) {
      const sku = selectedProduct.skus.find((s) => s.id === selectedSkuId);
      if (sku) {
        setValue("salePrice", sku.price);
      }
    }
  }, [selectedSkuId, selectedProduct, setValue]);

  const handleSubmit = async (data: AttachProductsData) => {
    const maxStock = selectedSku?.stock ?? 0;
    if (Number(data.stock) > maxStock) {
      methods.setError("stock", {
        type: "manual",
        message: t("stockExceeded", { max: String(maxStock) }),
      });
      return;
    }

    const success = await onSubmit(data.flashSaleId, {
      products: [
        {
          skuId: data.skuId,
          salePrice: Number(data.salePrice),
          stock: Number(data.stock),
          orderLimit: data.orderLimit ? Number(data.orderLimit) : undefined,
        },
      ],
    });

    if (success) {
      onClose();
    }
  };

  return (
    <AppDialog isOpen={isOpen} onClose={onClose}>
      <AppDialogPanel className="bg-surface/95 border-content/10 relative w-full max-w-xl overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-3xl">
        <div className="border-content/5 bg-surface/50 flex items-center justify-between border-b px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            <AppDialogTitle className="text-content text-xl font-bold">
              {t("title")}
            </AppDialogTitle>
            <p className="text-content/50 mt-1 text-sm">{t("description")}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-content/5 rounded-full"
            aria-label={tCommon("close")}
          >
            <XIcon className="size-5" />
          </Button>
        </div>

        <div className="p-6 sm:p-8">
          <AppForm
            methods={methods}
            onSubmit={handleSubmit}
            className={FORM_STACK_CLASS_NAME}
          >
            <FormSelect
              name="flashSaleId"
              label={t("flashSale")}
              options={flashSaleOptions}
              disabled={loading || !!preselectedFlashSaleId}
            />

            <FormSelectAutocomplete
              name="productId"
              label={t("product")}
              placeholder={
                loadingProducts ? t("loadingProducts") : t("product")
              }
              options={productOptions}
              disabled={loading || loadingProducts}
            />

            {selectedProductId && (
              <FormSelect
                name="skuId"
                label={t("sku")}
                options={skuOptions}
                disabled={loading}
              />
            )}

            {selectedSku && (
              <div className="text-content/70 ml-1 flex flex-col gap-1 text-sm font-semibold">
                <div>
                  {t("originalPrice", { price: String(selectedSku.price) })}
                </div>
                <div className="text-primary">
                  {t("remainingStock", {
                    stock: String(selectedSku.stock ?? 0),
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <FormInput
                name="salePrice"
                type="number"
                label={t("salePrice")}
                disabled={loading}
              />

              <FormInput
                name="stock"
                type="number"
                label={t("stock")}
                disabled={loading}
              />

              <FormInput
                name="orderLimit"
                type="number"
                label={t("orderLimit")}
                disabled={loading}
              />
            </div>

            <div className={FORM_ACTION_ROW_CLASS_NAME}>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" loading={loading}>
                {t("submit")}
              </Button>
            </div>
          </AppForm>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
}
