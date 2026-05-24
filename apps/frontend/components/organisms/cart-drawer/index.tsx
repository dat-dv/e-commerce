"use client";

import { APP_ROUTES } from "@/constants/routes";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useCart } from "@/hooks/cart/use-cart";
import { useRemoveFromCart } from "@/hooks/cart/use-remove-from-cart";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { CartDrawerFooter } from "./cart-drawer-footer";
import { CartHeader } from "./cart-drawer-header";
import { CartItem } from "./cart-drawer-item";

const DISABLED_EDIT_ROUTES: string[] = [APP_ROUTES.CHECKOUT];

export const CartDrawer = () => {
  const t = useTranslations("CartPage.drawer.empty");
  const pathname = usePathname();
  const { items, subtotal, setIsOpen, isOpen, itemsCount } = useCart();

  const isCheckoutPage = DISABLED_EDIT_ROUTES.includes(pathname);
  const addItem = useAddToCart();
  const { removeItem } = useRemoveFromCart();

  const handleClose = () => setIsOpen(false);

  const isEmpty = items.length === 0;
  const shouldShowFooter = items.length > 0;

  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with extreme blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] h-dvh w-dvw max-w-full overflow-hidden bg-black/40 backdrop-blur-md"
          />

          {/* Premium Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 350 }}
            className="bg-surface/95 border-content/5 fixed top-0 right-0 z-[101] flex h-dvh w-full max-w-full min-w-0 flex-col overflow-hidden border-l shadow-[0_0_100px_rgba(0,0,0,0.1)] backdrop-blur-3xl sm:max-w-[24rem]"
          >
            {/* Header Section */}
            <CartHeader count={itemsCount} onClose={handleClose} />

            {/* Scrollable Item List */}
            <div className="hide-scrollbar flex-1 overflow-y-auto px-6 py-2">
              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                  <div className="bg-content/[0.02] border-content/5 mb-6 flex h-20 w-20 items-center justify-center rounded-full border">
                    <ShoppingCart
                      size={32}
                      className="text-content/10"
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-content/80 text-lg font-bold tracking-tight">
                    {t("title")}
                  </h3>
                  <p className="text-content/30 mt-2 max-w-[180px] text-xs">
                    {t("description")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem
                      key={item.skuId}
                      item={item}
                      isCheckoutPage={isCheckoutPage}
                      onAdd={addItem}
                      onRemove={removeItem}
                      onCloseDrawer={handleClose}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Section */}
            {shouldShowFooter && (
              <CartDrawerFooter
                subtotal={subtotal}
                isCheckoutPage={isCheckoutPage}
                onClose={handleClose}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
