"use client";

import { useCartAdapter } from "@/hooks/cart/use-cart-adapter";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import Button from "@/components/atoms/button";

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalAmount, setIsOpen, isOpen } =
    useCartAdapter();

  const subtotal = totalAmount;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop làm mờ hậu cảnh */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Drawer Giỏ hàng chính */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-content/[0.1] z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-content/[0.05]">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingBag size={24} className="text-blue-500" />
                  Your Shopping Cart
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Danh sách Item */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                    <ShoppingBag size={48} className="mb-4 opacity-30" />
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-1">
                      Add some products to your cart!
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.sku_id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="bg-content/[0.02] p-4 rounded-xl border border-content/[0.05] flex gap-4"
                    >
                      {item.image_url && (
                        <Link
                          href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}
                          className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-content/[0.05] hover:border-content/[0.1] transition-colors"
                        >
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </Link>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium hover:text-blue-500 transition-colors line-clamp-1">
                            <Link
                              href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}
                            >
                              {item.name}
                            </Link>
                          </h3>
                          {item.attributes && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {item.attributes}
                            </p>
                          )}
                          <p className="text-sm font-semibold mt-1 text-blue-500">
                            {(item.price || 0).toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {/* Bộ tăng giảm số lượng */}
                          <div className="flex items-center border border-content/[0.05] rounded-lg overflow-hidden bg-content/[0.02]">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto py-1 px-3"
                              onClick={() =>
                                updateQuantity(
                                  item.sku_id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="px-3 py-1 bg-white/5 min-w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto py-1 px-3"
                              onClick={() =>
                                updateQuantity(item.sku_id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                          {/* Nút xóa */}
                          <Button
                            variant="danger"
                            size="icon"
                            className="rounded-full"
                            onClick={() => removeItem(item.sku_id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer thanh toán */}
              {items.length > 0 && (
                <div className="p-6 border-t border-content/[0.05] bg-content/[0.02]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-zinc-400">Subtotal:</span>
                    <span className="text-xl font-bold text-blue-500">
                      {subtotal.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full border border-content/[0.1] hover:bg-content/[0.05]"
                      href={APP_ROUTES.CART}
                      onClick={() => setIsOpen(false)}
                    >
                      View Cart
                    </Button>
                    <Button variant="primary" size="lg" className="w-full">
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
