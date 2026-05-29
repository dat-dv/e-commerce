"use client";

import { AppContainer, Button } from "@ecommerce/ui";

import { UI_RADIUS } from "@/constants/ui-radius";
import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { useAdminFlashSaleDetail } from "@/hooks/flash-sales/use-admin-flash-sale-detail";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AttachProductsModal } from "../admin-flash-sales-view/attach-products-modal";

interface AdminFlashSaleDetailViewProps {
  id: string;
}

function getFlashSaleStatus(startTimeStr: string, endTimeStr: string) {
  const now = Date.now();
  const startTime = new Date(startTimeStr).getTime();
  const endTime = new Date(endTimeStr).getTime();

  if (now < startTime) return "upcoming";
  if (now > endTime) return "ended";
  return "active";
}

export function AdminFlashSaleDetailView({
  id,
}: AdminFlashSaleDetailViewProps) {
  const t = useTranslations("AdminFlashSalesPage.detail");
  const locale = useLocale();

  const {
    flashSale,
    loading: loadingCampaign,
    hasError,
    refresh,
    addProductsToFlashSale,
  } = useAdminFlashSaleDetail(id);

  const [products, setProducts] = useState<TProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingProducts(true);
    productsUseCase.getProducts
      .execute({ limit: 100 })
      .then((res) => {
        if (res.status === "success" && res.data?.items) {
          setProducts(res.data.items);
        }
      })
      .catch((err) => {
        console.error("Failed to load products for detail map", err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  const productMap = useMemo(() => {
    const map = new Map<string, { product: TProduct; sku: TSkuDomain }>();
    for (const prod of products) {
      for (const sku of prod.skus) {
        map.set(sku.id, { product: prod, sku });
      }
    }
    return map;
  }, [products]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: locale === "vi" ? "VND" : "USD",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  };

  const status = flashSale
    ? getFlashSaleStatus(flashSale.startTime, flashSale.endTime)
    : "upcoming";

  const statusLabel = {
    active: locale === "vi" ? "Đang diễn ra" : "Active",
    upcoming: locale === "vi" ? "Sắp diễn ra" : "Upcoming",
    ended: locale === "vi" ? "Đã kết thúc" : "Ended",
  }[status];

  const statusColor = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    upcoming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ended: "bg-content/10 text-content/50 border-content/20",
  }[status];

  const loading = loadingCampaign || loadingProducts;

  return (
    <main className="bg-surface text-content relative min-h-screen overflow-x-hidden py-8">
      <AppContainer size="2xl" className="flex flex-col gap-8">
        <div>
          <Link
            href="/admin/flash-sales"
            className="text-content/60 hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("backToList")}
          </Link>
        </div>

        {loading && !flashSale ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="size-8 animate-spin opacity-45" />
          </div>
        ) : hasError || !flashSale ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <p className="text-sm font-semibold text-red-500">
              {locale === "vi"
                ? "Lỗi tải thông tin chiến dịch."
                : "Failed to load campaign information."}
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw aria-hidden="true" className="size-4" />
              {locale === "vi" ? "Thử lại" : "Retry"}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-surface/50 border-content/5 rounded-3xl border p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{flashSale.name}</h1>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase",
                        statusColor,
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-content/50 mt-1 text-sm">
                    ID:{" "}
                    <code className="font-mono text-xs">{flashSale.id}</code>
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={refresh}
                  >
                    <RefreshCw className="size-4" />
                    {t("refreshBtn")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsAttachModalOpen(true)}
                  >
                    <Plus className="size-4" />
                    {t("attachProductBtn")}
                  </Button>
                </div>
              </div>

              <hr className="border-content/5 my-6" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <h3 className="text-content/50 text-xs font-semibold tracking-wider uppercase">
                    {t("duration")}
                  </h3>
                  <div className="mt-1 text-sm font-medium">
                    {formatDate(flashSale.startTime)} —{" "}
                    {formatDate(flashSale.endTime)}
                  </div>
                </div>

                <div>
                  <h3 className="text-content/50 text-xs font-semibold tracking-wider uppercase">
                    {t("timeSlot")}
                  </h3>
                  <div className="mt-1 text-sm font-medium">
                    {flashSale.timeSlot ? (
                      <span>
                        {flashSale.timeSlot.name} (
                        {String(flashSale.timeSlot.startHour).padStart(2, "0")}:
                        {String(flashSale.timeSlot.startMinute).padStart(
                          2,
                          "0",
                        )}{" "}
                        - {String(flashSale.timeSlot.endHour).padStart(2, "0")}:
                        {String(flashSale.timeSlot.endMinute).padStart(2, "0")})
                      </span>
                    ) : (
                      <span className="text-content/45 italic">
                        {t("timeSlotNone")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface/50 border-content/5 overflow-hidden rounded-3xl border backdrop-blur-xl">
              <div className="border-content/5 border-b px-6 py-5 sm:px-8">
                <h2 className="text-lg font-bold">
                  {t("attachedProducts", {
                    count: String(flashSale.products.length),
                  })}
                </h2>
              </div>

              {flashSale.products.length === 0 ? (
                <div className="text-content/45 flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <p className="text-sm font-medium">
                    {t("emptyAttachedProducts")}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsAttachModalOpen(true)}
                  >
                    <Plus className="size-4" />
                    {t("attachProductBtn")}
                  </Button>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-content/[0.06] text-content/50 border-b font-medium">
                        <th className="px-6 py-4">{t("table.product")}</th>
                        <th className="px-6 py-4">{t("table.sku")}</th>
                        <th className="px-6 py-4">
                          {t("table.originalPrice")}
                        </th>
                        <th className="px-6 py-4">{t("table.salePrice")}</th>
                        <th className="px-6 py-4">{t("table.stock")}</th>
                        <th className="px-6 py-4">{t("table.sold")}</th>
                        <th className="px-6 py-4">{t("table.orderLimit")}</th>
                        <th className="px-6 py-4 text-right">
                          {t("table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {flashSale.products.map((p) => {
                        const lookup = productMap.get(p.skuId);
                        const productName = lookup
                          ? lookup.product.name
                          : locale === "vi"
                            ? `Sản phẩm (${p.skuId.substring(0, 8)})`
                            : `Product (${p.skuId.substring(0, 8)})`;
                        const originalPrice = lookup ? lookup.sku.price : 0;
                        const attributes = lookup?.sku.attributes
                          ? lookup.sku.attributes
                              .map(
                                (a) => `${String(a.name)}: ${String(a.value)}`,
                              )
                              .join(", ")
                          : p.skuCode || "—";

                        const progress =
                          p.stock > 0
                            ? Math.min(
                                100,
                                Math.round((p.soldCount / p.stock) * 100),
                              )
                            : 0;

                        const productImage =
                          lookup?.sku?.imageUrl ||
                          lookup?.product?.imageUrl ||
                          "";

                        const productDetailUrl = lookup
                          ? APP_ROUTES.PRODUCT_DETAIL(lookup.product.slug)
                          : null;

                        return (
                          <tr
                            key={p.id}
                            className="border-content/[0.06] hover:bg-content/[0.015] border-b transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {productDetailUrl ? (
                                  <Link
                                    href={productDetailUrl}
                                    target="_blank"
                                    className={cn(
                                      UI_RADIUS.media,
                                      "border-content/[0.05] bg-content/[0.02] relative block size-12 shrink-0 overflow-hidden border transition-transform hover:scale-105 active:scale-95",
                                    )}
                                  >
                                    {productImage ? (
                                      <Image
                                        src={productImage}
                                        alt={productName}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="bg-content/[0.05] text-content/20 flex h-full w-full items-center justify-center">
                                        <ShoppingBag size={16} aria-hidden />
                                      </div>
                                    )}
                                  </Link>
                                ) : (
                                  <div
                                    className={cn(
                                      UI_RADIUS.media,
                                      "border-content/[0.05] bg-content/[0.02] relative block size-12 shrink-0 overflow-hidden border",
                                    )}
                                  >
                                    {productImage ? (
                                      <Image
                                        src={productImage}
                                        alt={productName}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="bg-content/[0.05] text-content/20 flex h-full w-full items-center justify-center">
                                        <ShoppingBag size={16} aria-hidden />
                                      </div>
                                    )}
                                  </div>
                                )}
                                <span className="font-semibold">
                                  {productDetailUrl ? (
                                    <Link
                                      href={productDetailUrl}
                                      target="_blank"
                                      className="hover:text-primary transition-colors hover:underline"
                                    >
                                      {productName}
                                    </Link>
                                  ) : (
                                    productName
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="text-content/65 px-6 py-4 font-mono text-xs">
                              {attributes}
                            </td>
                            <td className="text-content/55 px-6 py-4">
                              {originalPrice > 0
                                ? formatPrice(originalPrice)
                                : "—"}
                            </td>
                            <td className="text-primary px-6 py-4 font-bold">
                              {formatPrice(p.salePrice)}
                            </td>
                            <td className="px-6 py-4 font-medium">{p.stock}</td>
                            <td className="px-6 py-4">
                              <div className="flex w-32 flex-col gap-1.5">
                                <div className="flex justify-between text-xs font-medium">
                                  <span>{p.soldCount}</span>
                                  <span className="text-content/50">
                                    {progress}%
                                  </span>
                                </div>
                                <div className="bg-content/[0.08] h-1.5 w-full overflow-hidden rounded-full">
                                  <div
                                    className="bg-primary h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="text-content/60 px-6 py-4">
                              {p.orderLimit || "—"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {productDetailUrl ? (
                                <Link
                                  href={productDetailUrl}
                                  target="_blank"
                                  className="text-primary hover:text-primary-dark inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                                >
                                  {locale === "vi" ? "Xem" : "View"}
                                  <ExternalLink className="size-3" />
                                </Link>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <AttachProductsModal
              isOpen={isAttachModalOpen}
              loading={loadingCampaign}
              flashSales={[flashSale]}
              preselectedFlashSaleId={flashSale.id}
              onClose={() => setIsAttachModalOpen(false)}
              onSubmit={async (_id, input) => addProductsToFlashSale(input)}
            />
          </>
        )}
      </AppContainer>
    </main>
  );
}
