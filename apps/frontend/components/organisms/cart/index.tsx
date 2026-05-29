"use client";

import { AppContainer } from "@ecommerce/ui";
import { useCart } from "@/hooks/cart/use-cart";
import { useRemoveFromCart } from "@/hooks/cart/use-remove-from-cart";
import { useUpdateCartQuantity } from "@/hooks/cart/use-update-cart-quantity";
import { AnimatePresence } from "framer-motion";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { CartPageHeader } from "./cart-page-header";
import { CartSummary } from "./cart-summary";

import { CartTableHead } from "@/components/molecules/cart-part/cart-table-head";
import { CartItemRow } from "@/components/molecules/cart-part/cart-item-row";
import { CartFooter } from "@/components/molecules/cart-part/cart-footer";
import { EmptyCart } from "@/components/molecules/cart-part/empty-cart";

export function CartView() {
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

  const isEmpty = items.length === 0;
  const itemCount = items.length;
  const selectedCount = selectedSkuIds.length;

  return (
    <AppContainer className="pb-6">
      <CartPageHeader itemCount={itemCount} />
      <CartSummary
        itemCount={itemCount}
        selectedCount={selectedCount}
        totalAmount={totalAmount}
      />

      {isEmpty ? (
        <div className="space-y-12">
          <EmptyCart />
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <CartTableHead
            isAllSelected={isAllSelected}
            onToggleSelectAll={handleToggleSelectAll}
          />

          <div className="space-y-3 md:space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemRow
                  key={item.skuId}
                  item={item}
                  isSelected={selectedSkuIds.includes(item.skuId)}
                  onToggleSelect={() => toggleSelectItem(item.skuId)}
                  onRemove={() => removeItem(item)}
                  onUpdateQuantity={(val) => updateQuantity(item, val)}
                />
              ))}
            </AnimatePresence>
          </div>

          <CartFooter selectedCount={selectedCount} totalAmount={totalAmount} />
        </div>
      )}

      <DiscoveryCarouselSection />
    </AppContainer>
  );
}
