import Button from "@/components/atoms/button";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

interface IOrderSummaryProps {
  totalAmount: number;
  onPlaceOrder: () => void;
  loading: boolean;
  isItemsEmpty: boolean;
  recipientName?: string;
  recipientPhone?: string;
}

export const OrderSummary = ({
  totalAmount,
  onPlaceOrder,
  loading,
  isItemsEmpty,
  recipientName,
  recipientPhone,
}: IOrderSummaryProps) => {
  const t = useTranslations("CheckoutPage.summary");

  return (
    <div className="lg:col-span-4 lg:sticky lg:top-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-content/5 bg-surface/90 p-5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] backdrop-blur-3xl md:rounded-[2.5rem] md:p-8"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 bg-primary/[0.03] blur-[60px]" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2 opacity-60 md:mb-8">
            <ShoppingBag size={14} className="text-content" aria-hidden />
            <span className="text-sm font-semibold text-content capitalize">
              {t("title")}
            </span>
          </div>

          {/* Recipient Summary */}
          {recipientName && (
            <div className="mb-6 border-b border-content/[0.08] pb-5 md:mb-8 md:pb-6">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-content/30">
                {t("shippingTo")}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="font-bold text-sm text-content capitalize">
                  {recipientName}
                </div>
                <div className="text-xs text-content/60">{recipientPhone}</div>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-4 md:mb-8">
            <div className="flex justify-between text-sm text-content/60">
              <span className="capitalize">{t("subtotal")}</span>
              <span className="text-content font-medium">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-content/60">
              <span className="capitalize">{t("shippingFee")}</span>
              <span className="text-green-500 font-bold tracking-wide">
                {t("free")}
              </span>
            </div>
            <div className="flex justify-between text-sm text-content/60">
              <span className="capitalize">{t("tax")}</span>
              <span className="text-content font-medium">$0.00</span>
            </div>

            <div className="my-5 h-px bg-content/5 md:my-6" />

            {/* Integrated Payment Method */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3 opacity-60">
                <span className="text-xs font-semibold text-content capitalize">
                  {t("paymentMethod")}
                </span>
              </div>
              <div className="text-xs text-content/60">{t("cod")}</div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col text-content">
                <span className="mb-1 text-xs font-semibold capitalize text-content">
                  {t("grandTotal")}
                </span>
                <span className="break-words text-2xl font-bold tracking-tight md:text-3xl">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onPlaceOrder}
            disabled={loading || isItemsEmpty}
            loading={loading}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl py-5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all md:py-6 md:tracking-[0.3em]",
              loading || isItemsEmpty
                ? "bg-content/5 text-content/20 cursor-not-allowed"
                : "bg-primary text-surface hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20",
            )}
          >
            {loading ? t("processing") : t("complete")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
