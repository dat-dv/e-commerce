"use client";

import { useCartStore } from "@/hooks/cart/use-cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(true); // Để true để anh dễ thấy ngay khi tích hợp vào Layout
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Nút mở giỏ hàng nhanh (Floating Button) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <ShoppingBag size={24} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
            {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-l border-white/20 z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingBag size={24} className="text-blue-500" />
                  Giỏ hàng của bạn
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
                    <p>Giỏ hàng đang trống</p>
                    <p className="text-sm mt-1">
                      Hãy thêm sản phẩm vào đây nhé!
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
                      className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex gap-4"
                    >
                      {item.image_url && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">
                            {item.name}
                          </h3>
                          {item.attributes && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {item.attributes}
                            </p>
                          )}
                          <p className="text-sm font-semibold mt-1 text-blue-500">
                            {item.price.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {/* Bộ tăng giảm số lượng */}
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.sku_id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="px-3 py-1 hover:bg-white/10 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 bg-white/5 min-w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.sku_id, item.quantity + 1)
                              }
                              className="px-3 py-1 hover:bg-white/10 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          {/* Nút xóa */}
                          <button
                            onClick={() => removeItem(item.sku_id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer thanh toán */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-zinc-400">Tổng tiền tạm tính:</span>
                    <span className="text-xl font-bold text-blue-500">
                      {subtotal.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 active:scale-98 transform">
                    Tiến hành thanh toán
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
