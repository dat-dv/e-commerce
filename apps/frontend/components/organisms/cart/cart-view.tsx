"use client";

import { useCartStore } from "@/hooks/cart/use-cart-store";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

export default function CartView() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const _hasHydrated = useCartStore((s) => s._hasHydrated);

  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0,
  );

  if (!_hasHydrated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[50vh] flex items-center justify-center">
        <div className="text-content/40">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-black mb-8 text-content">
        Your Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="bg-content/[0.02] border border-content/[0.05] rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <ShoppingBag size={64} className="text-content/20 mb-4" />
          <h2 className="text-xl font-bold text-content mb-2">
            Your cart is empty
          </h2>
          <p className="text-content/60 mb-6">
            Add some amazing products to your cart!
          </p>
          <Link
            href={APP_ROUTES.HOME}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 active:scale-98 transform"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Product List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.sku_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-content/[0.02] border border-content/[0.05] rounded-2xl p-4 flex gap-4 items-center"
              >
                {item.image_url && (
                  <Link
                    href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}
                    className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-content/[0.05] hover:border-content/[0.1] transition-colors"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                )}

                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-content hover:text-blue-500 transition-colors line-clamp-2">
                      <Link href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}>
                        {item.name}
                      </Link>
                    </h3>
                    {item.attributes && (
                      <p className="text-xs text-content/40 mt-1">
                        {item.attributes}
                      </p>
                    )}
                    <p className="text-sm font-black text-blue-500 mt-1">
                      {(item.price || 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end">
                    <div className="flex items-center border border-content/[0.05] rounded-lg overflow-hidden bg-content/[0.02]">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.sku_id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="p-2 hover:bg-content/[0.05] transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.sku_id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-content/[0.05] transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-content min-w-[100px] text-right">
                      {((item.price || 0) * item.quantity).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      đ
                    </p>

                    <button
                      onClick={() => removeItem(item.sku_id)}
                      className="p-2 text-content/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-content/[0.02] border border-content/[0.05] rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-content mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-content/[0.05] pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-content/60">Subtotal:</span>
                  <span className="text-content font-medium">
                    {subtotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-content/60">Shipping:</span>
                  <span className="text-content font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-content">Total:</span>
                <span className="text-xl font-black text-blue-500">
                  {subtotal.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 active:scale-98 transform">
                Proceed to Checkout
              </button>

              <Link
                href={APP_ROUTES.HOME}
                className="block text-center text-sm text-content/40 hover:text-content transition-colors mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
