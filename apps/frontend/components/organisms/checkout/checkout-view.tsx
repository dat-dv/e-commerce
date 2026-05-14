"use client";

import React from "react";
import { useCheckoutAdapter } from "@/hooks/checkout/use-checkout-adapter";
import { useCreateAddress } from "@/hooks/addresses/use-create-address";
import { CheckoutHeader } from "./components/checkout-header";
import { ShippingSection } from "./components/shipping-section";
import { PaymentSection } from "./components/payment-section";
import { OrderItemsSection } from "./components/order-items-section";
import { OrderSummary } from "./components/order-summary";
import { AddAddressModal } from "./components/add-address-modal";

export const CheckoutView = () => {
  const {
    selectedItems,
    totalAmount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading: loadingAddresses,
    placingOrder,
    handlePlaceOrder,
    handleAddAddress,
  } = useCheckoutAdapter();

  const {
    isOpen: isAddModalOpen,
    isSubmitting: isAddingAddress,
    open: openAddModal,
    close: closeAddModal,
    handleSubmit: onAddAddressSubmit,
  } = useCreateAddress({
    onSubmit: handleAddAddress,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <CheckoutHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-16">
          <ShippingSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            loading={loadingAddresses}
            onAddAddress={openAddModal}
          />

          <PaymentSection />

          <OrderItemsSection items={selectedItems} />
        </div>

        {/* Right Column: Order Summary */}
        <OrderSummary
          totalAmount={totalAmount}
          onPlaceOrder={handlePlaceOrder}
          loading={placingOrder}
          isItemsEmpty={selectedItems.length === 0}
        />
      </div>

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={onAddAddressSubmit}
        loading={isAddingAddress}
      />
    </div>
  );
};
