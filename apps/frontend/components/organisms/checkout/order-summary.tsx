import Button from "@/components/atoms/button";
import TurnstileWrapper from "@/components/molecules/cloudflare-turnstile";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
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
    <div className="lg:sticky lg:top-32 lg:col-span-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          UI_RADIUS.panel,
          "border-content/5 bg-surface/90 relative overflow-hidden border p-5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] backdrop-blur-3xl md:p-8",
        )}
      >
        <div className="bg-primary/10 pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 blur-[80px]" />
        <div className="bg-primary/[0.03] pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 blur-[60px]" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2 opacity-60 md:mb-8">
            <ShoppingBag size={14} className="text-content" aria-hidden />
            <span className="text-content text-sm font-semibold capitalize">
              {t("title")}
            </span>
          </div>

          {/* Recipient Summary */}
          {recipientName && (
            <div className="border-content/[0.08] mb-6 border-b pb-5 md:mb-8 md:pb-6">
              <div
                className={`mb-2 ${TYPOGRAPHY.badge} text-content/30 tracking-wider uppercase`}
              >
                {t("shippingTo")}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-content text-sm font-bold capitalize">
                  {recipientName}
                </div>
                <div className="text-content/60 text-xs">{recipientPhone}</div>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-4 md:mb-8">
            <div className="text-content/60 flex justify-between text-sm">
              <span className="capitalize">{t("subtotal")}</span>
              <span className="text-content font-medium">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="text-content/60 flex justify-between text-sm">
              <span className="capitalize">{t("shippingFee")}</span>
              <span className="font-bold tracking-wide text-green-500">
                {t("free")}
              </span>
            </div>
            <div className="text-content/60 flex justify-between text-sm">
              <span className="capitalize">{t("tax")}</span>
              <span className="text-content font-medium">$0.00</span>
            </div>

            <div className="bg-content/5 my-5 h-px md:my-6" />

            {/* Integrated Payment Method */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2 opacity-60">
                <span className="text-content text-xs font-semibold capitalize">
                  {t("paymentMethod")}
                </span>
              </div>
              <div className="text-content/60 text-xs">{t("cod")}</div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="text-content flex flex-col">
                <span className="text-content mb-1 text-xs font-semibold capitalize">
                  {t("grandTotal")}
                </span>
                <span className="text-2xl font-bold tracking-tight break-words md:text-3xl">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <TurnstileWrapper>
            {({ isVerified, token }) => {
              const isLoading = !isVerified && loading && !isItemsEmpty;
              const disabled = !isVerified || isLoading || isItemsEmpty;
              return (
                <Button
                  onClick={onPlaceOrder}
                  disabled={disabled}
                  loading={isLoading}
                  className={cn(
                    UI_RADIUS.control,
                    `relative w-full overflow-hidden py-5 ${TYPOGRAPHY.caption} font-semibold tracking-[0.18em] uppercase transition-all md:py-6 md:tracking-[0.3em]`,
                    isLoading
                      ? "bg-content/5 text-content/20 cursor-not-allowed"
                      : "bg-primary text-surface transition-all hover:opacity-90 active:scale-[0.98]",
                  )}
                >
                  {loading ? t("processing") : t("complete")}
                </Button>
              );
            }}
          </TurnstileWrapper>
        </div>
      </motion.div>
    </div>
  );
};
