"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/cart/use-cart";
import { useRemoveFromCart } from "@/hooks/cart/use-remove-from-cart";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  X,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

const DISABLED_EDIT_ROUTES: string[] = [APP_ROUTES.CHECKOUT];

export const CartDrawer = () => {
  const pathname = usePathname();
  const { items, subtotal, setIsOpen, isOpen } = useCart();

  const isCheckoutPage = DISABLED_EDIT_ROUTES.includes(pathname);

  const addItem = useAddToCart();
  const { removeItem } = useRemoveFromCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with extreme blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
          />

          {/* Premium Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 350 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface/80 backdrop-blur-3xl border-l border-content/10 z-[101] shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between p-8 relative">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-content/30 mb-2 block">
                  Curation
                </span>
                <h2 className="text-3xl font-black tracking-tighter leading-none flex items-center gap-2">
                  SHOPPING{" "}
                  <span className="italic font-light opacity-30">BAG</span>
                </h2>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-content/[0.03] hover:bg-content/[0.08] transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto px-8 py-4 relative scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-content/[0.02] flex items-center justify-center mb-8 border border-content/5">
                    <ShoppingBag size={40} className="opacity-10" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                    The Bag is Empty
                  </h3>
                  <p className="text-sm text-content/40 italic font-light max-w-[200px]">
                    Your premium selection will appear here once added.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div
                      key={item.sku_id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex gap-6 relative"
                    >
                      {/* Image Container with Floating Effect */}
                      <div className="relative w-24 h-32 rounded-2xl overflow-hidden bg-content/[0.02] border border-content/5 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-content/10">
                            <ShoppingBag size={32} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            <Link
                              href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}
                              onClick={() => setIsOpen(false)}
                            >
                              {item.name}
                            </Link>
                          </h4>
                          <span className="text-[9px] uppercase tracking-widest font-black text-content/30 italic font-light">
                            {item.attributes || "Standard Edition"}
                          </span>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          <div className="space-y-3">
                            <div className="text-lg font-black text-content tracking-tighter">
                              ${(item.price || 0).toLocaleString()}
                            </div>

                            {/* Modern Quantity Control */}
                            {!isCheckoutPage ? (
                              <div className="flex items-center gap-1 bg-content/[0.03] p-1 rounded-xl border border-content/5">
                                <button
                                  onClick={() => addItem(item, -1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-xs font-black">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => addItem(item, 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="text-[10px] uppercase tracking-[0.2em] font-black text-content/30 bg-content/[0.02] px-3 py-1.5 rounded-lg border border-content/5 inline-block italic">
                                Quantity: {item.quantity}
                              </div>
                            )}
                          </div>

                          {!isCheckoutPage && (
                            <button
                              onClick={() => removeItem(item)}
                              className="p-3 text-content/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-content/[0.02] border-t border-content/10 relative">
                <div className="flex items-end justify-between mb-6">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-content/30 block">
                      Total Sum
                    </span>
                    <div className="text-2xl font-black tracking-tighter text-primary leading-none">
                      ${subtotal.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-500">
                      FREE SHIPPING
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {!isCheckoutPage ? (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Link
                        href={APP_ROUTES.CHECKOUT}
                        onClick={() => setIsOpen(false)}
                        className="w-full h-14 flex items-center justify-center bg-content text-surface rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-content/20 hover:bg-primary hover:text-primary-foreground transition-all group"
                      >
                        Begin Checkout
                        <ChevronRight
                          size={16}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="w-full h-14 flex items-center justify-center bg-content/[0.05] text-content/40 rounded-xl font-black text-[9px] uppercase tracking-[0.4em] border border-content/10 italic">
                      Finalizing Order
                    </div>
                  )}

                  <Link
                    href={APP_ROUTES.CART}
                    onClick={() => setIsOpen(false)}
                    className="w-full block text-center text-[10px] uppercase tracking-[0.2em] font-black text-content/30 hover:text-content transition-colors pt-1"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
