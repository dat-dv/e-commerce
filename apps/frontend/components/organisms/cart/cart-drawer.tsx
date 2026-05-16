"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/cart/use-cart";
import { useRemoveFromCart } from "@/hooks/cart/use-remove-from-cart";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";

import { CartHeader } from "./components/cart-header";
import { CartItem } from "./components/cart-item";
import { CartDrawerFooter } from "./components/cart-drawer-footer";

const DISABLED_EDIT_ROUTES: string[] = [APP_ROUTES.CHECKOUT];

export const CartDrawer = () => {
  const pathname = usePathname();
  const { items, subtotal, setIsOpen, isOpen, itemsCount } = useCart();

  const isCheckoutPage = DISABLED_EDIT_ROUTES.includes(pathname);
  const addItem = useAddToCart();
  const { removeItem } = useRemoveFromCart();

  const handleClose = () => setIsOpen(false);

  const isEmpty = items.length === 0;
  const shouldShowFooter = items.length > 0;

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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
          />

          {/* Premium Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 350 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface/95 backdrop-blur-3xl border-l border-content/5 z-[101] shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
          >
            {/* Header Section */}
            <CartHeader count={itemsCount} onClose={handleClose} />

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-content/[0.02] flex items-center justify-center mb-6 border border-content/5">
                    <ShoppingBag size={32} className="text-content/10" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-content/80">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-content/30 mt-2 max-w-[180px]">
                    Explore our products and find something you love.
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
