import EmptyState from "@/components/molecules/empty-space";
import { APP_ROUTES } from "@/constants/routes";
import { TCartItem } from "@/store/cart-store/cart-store.type";
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
        <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-content text-surface shadow-lg shadow-content/10 md:size-10">
            <Package size={20} aria-hidden />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
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
      <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-content text-surface shadow-lg shadow-content/10 md:size-10">
          <Package size={20} aria-hidden />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
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
              className="group flex flex-col gap-4 rounded-2xl border border-content/[0.05] bg-surface/40 p-4 shadow-sm backdrop-blur-md transition-all hover:bg-surface/60 sm:flex-row sm:items-center sm:gap-5 md:gap-6 md:rounded-[2rem] md:p-6"
            >
              <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-xl border border-content/[0.08] bg-content/[0.02] sm:h-28 sm:w-24">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-content/10">
                    <ShoppingBag size={24} aria-hidden />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-col gap-2 sm:mb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h4 className="line-clamp-2 text-sm font-bold text-content sm:truncate">
                    {item.name}
                  </h4>
                  <div className="shrink-0 text-base font-black tracking-tight text-content sm:tracking-tighter">
                    {displayTotal}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] font-medium text-content/40">
                    <span className="max-w-full truncate">
                      {item.attributes || t("standard")}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-content/20" />
                    <span className="text-content/60">
                      {t("quantity", { count: String(item.quantity) })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isDiscounted && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-semibold text-content/60">
                        {displayPrice}
                      </span>
                      {isDiscounted && (
                        <span className="text-[10px] text-content/20 line-through">
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
