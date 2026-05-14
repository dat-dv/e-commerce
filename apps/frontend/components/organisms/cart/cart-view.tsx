"use client";

import { useCart } from "@/hooks/cart/use-cart";
import { useRemoveFromCart } from "@/hooks/cart/use-remove-from-cart";
import { useUpdateCartQuantity } from "@/hooks/cart/use-update-cart-quantity";
import { AnimatePresence } from "framer-motion";
import CartRecommendations from "./cart-recommendations";

import { CartHeader } from "../../molecules/cart-part/cart-header";
import { CartTableHead } from "../../molecules/cart-part/cart-table-head";
import { CartItemRow } from "../../molecules/cart-part/cart-item-row";
import { CartFooter } from "../../molecules/cart-part/cart-footer";
import { EmptyCart } from "../../molecules/cart-part/empty-cart";

export default function CartView() {
  const {
    items,
    selectedSkuIds,
    totalAmount,
    isAllSelected,
    toggleSelectItem,
    handleToggleSelectAll,
  } = useCart();
  const { removeItem } = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CartHeader itemCount={items.length} />

      {items.length === 0 ? (
        <div className="space-y-12">
          <EmptyCart />
          <CartRecommendations />
        </div>
      ) : (
        <div className="space-y-6">
          <CartTableHead
            isAllSelected={isAllSelected}
            onToggleSelectAll={handleToggleSelectAll}
          />

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemRow
                  key={item.sku_id}
                  item={item}
                  isSelected={selectedSkuIds.includes(item.sku_id)}
                  onToggleSelect={() => toggleSelectItem(item.sku_id)}
                  onRemove={() => removeItem(item)}
                  onUpdateQuantity={(val) => updateQuantity(item, val)}
                />
              ))}
            </AnimatePresence>
          </div>

          <CartFooter
            selectedCount={selectedSkuIds.length}
            totalAmount={totalAmount}
          />

          <CartRecommendations />
        </div>
      )}
    </div>
  );
}
