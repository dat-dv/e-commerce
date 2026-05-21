import EmptyState from "@/components/molecules/empty-space";
import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface CheckoutListProps {
  items: TCartItem[];
}

export const CheckoutList = ({ items }: CheckoutListProps) => {
  const t = useTranslations("CheckoutPage.items");

  if (items.length === 0) {
    return (
      <section>
        <div className="mb-6 flex min-w-0 items-center gap-3 md:mb-8 md:gap-4">
          <div className="bg-content text-surface shadow-content/10 flex size-8 shrink-0 items-center justify-center rounded-full shadow-lg md:size-10">
            <Package size={18} aria-hidden />
          </div>
          <h2 className="text-content min-w-0 text-lg font-black tracking-normal whitespace-nowrap uppercase md:text-2xl md:tracking-tight">
            {t("title")}
          </h2>
        </div>
        <EmptyState
          title={t("empty.title")}
          description={t("empty.description")}
          icon={ShoppingBag}
          actionLabel={t("empty.action")}
          actionHref={APP_ROUTES.RECENTLY_VIEWED}
          className="py-12"
        />
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex min-w-0 items-center gap-3 md:mb-8 md:gap-4">
        <div className="bg-content text-surface shadow-content/10 flex size-8 shrink-0 items-center justify-center rounded-full shadow-lg md:size-10">
          <Package size={18} aria-hidden />
        </div>
        <h2 className="text-content min-w-0 text-lg font-black tracking-normal whitespace-nowrap uppercase md:text-2xl md:tracking-tight">
          {t("title")}
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const originalPrice = item.originalPrice || 0;
          const itemTotal = item.price * item.quantity;
          const isDiscounted = originalPrice > item.price;
          const discountPercent = isDiscounted
            ? Math.round((1 - item.price / originalPrice) * 100)
            : 0;

          const displayPrice = formatCurrency(item.price);
          const displayOriginalPrice = formatCurrency(item.originalPrice);
          const displayTotal = formatCurrency(itemTotal);

          return (
            <motion.div
              key={item.skuId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                UI_RADIUS.card,
                "group border-content/[0.05] bg-surface/40 hover:bg-surface/60 flex items-center gap-3 border p-4 shadow-sm backdrop-blur-md transition-all sm:gap-5 md:gap-6 md:p-6",
              )}
            >
              <div
                className={cn(
                  UI_RADIUS.media,
                  "border-content/[0.08] bg-content/[0.02] relative size-20 shrink-0 overflow-hidden border sm:h-28 sm:w-24",
                )}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="text-content/10 flex h-full w-full items-center justify-center">
                    <ShoppingBag size={24} aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="text-content line-clamp-2 min-w-0 flex-1 text-sm leading-tight font-bold sm:truncate">
                    {item.name}
                  </h4>
                  <div className="text-content shrink-0 text-sm font-black tracking-tight sm:text-base sm:tracking-tighter">
                    {displayTotal}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div
                    className={`flex min-w-0 items-center gap-2 ${TYPOGRAPHY.caption} text-content/40 font-medium`}
                  >
                    <span className="min-w-0 truncate">
                      {item.attributes || t("standard")}
                    </span>
                    <span className="bg-content/20 h-1 w-1 shrink-0 rounded-full" />
                    <span className="text-content/60 shrink-0">
                      {t("quantity", { count: String(item.quantity) })}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                    {isDiscounted && (
                      <span
                        className={cn(
                          UI_RADIUS.badge,
                          `bg-red-400/10 px-1.5 py-0.5 ${TYPOGRAPHY.badge} text-red-400`,
                        )}
                      >
                        -{discountPercent}%
                      </span>
                    )}
                    <div className="flex min-w-0 items-baseline gap-1.5">
                      <span
                        className={`${TYPOGRAPHY.caption} text-content/60 font-semibold`}
                      >
                        {displayPrice}
                      </span>
                      {isDiscounted && (
                        <span
                          className={`${TYPOGRAPHY.badge} text-content/20 font-normal line-through`}
                        >
                          {displayOriginalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
