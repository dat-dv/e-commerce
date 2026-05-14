"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { APP_ROUTES } from "@/constants/routes";
import { useCheckoutAdapter } from "@/hooks/checkout/use-checkout-adapter";
import { cn } from "@/utils/cn";

export const CheckoutView = () => {
  const {
    selectedItems,
    totalAmount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading,
    placingOrder,
    handlePlaceOrder,
  } = useCheckoutAdapter();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header Section */}
      <div className="mb-12">
        <Link
          href={APP_ROUTES.CART}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-content/40 hover:text-primary transition-colors mb-6 group"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Shopping Bag
        </Link>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase">
          CHECK<span className="italic font-light opacity-20">OUT</span>
        </h1>
        <div className="h-px w-24 bg-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-16">
          {/* Shipping Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-content text-surface flex items-center justify-center shadow-lg shadow-content/10">
                <MapPin size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 py-12 text-center text-content/20 italic font-light">
                  Loading addresses...
                </div>
              ) : addresses.length > 0 ? (
                addresses.map((address) => (
                  <motion.div
                    key={address.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={cn(
                      "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                      selectedAddressId === address.id
                        ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/5"
                        : "border-content/10 hover:border-content/30 bg-surface/50 backdrop-blur-sm",
                    )}
                  >
                    {selectedAddressId === address.id && (
                      <div className="absolute top-0 right-0 p-3 text-primary">
                        <ShieldCheck size={20} />
                      </div>
                    )}
                    <div className="text-[10px] uppercase tracking-widest font-black text-content/40 mb-3 flex justify-between items-center">
                      <span>
                        {address.isDefault ? "Default Address" : "Address"}
                      </span>
                    </div>
                    <div className="font-bold text-lg mb-1">{address.name}</div>
                    <div className="text-content/60 text-sm mb-4">
                      {address.phone}
                    </div>
                    <div className="text-sm leading-relaxed text-content/80 italic font-light">
                      {address.street}, {address.ward}
                      <br />
                      {address.district}, {address.province}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 p-12 rounded-3xl border border-dashed border-content/10 flex flex-col items-center justify-center text-center">
                  <div className="text-content/30 mb-4 font-light italic">
                    No addresses found
                  </div>
                  <button className="px-8 py-3 bg-content text-surface text-[11px] uppercase tracking-widest font-black rounded-full hover:bg-primary transition-all">
                    Add New Address
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Payment Section (Simulation) */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-content text-surface flex items-center justify-center shadow-lg shadow-content/10">
                <CreditCard size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Payment Method
              </h2>
            </div>

            <div className="p-8 rounded-3xl bg-surface/50 backdrop-blur-xl border border-content/5 shadow-inner">
              <div className="flex items-center gap-6">
                <div className="w-16 h-10 bg-content/5 rounded-lg flex items-center justify-center border border-content/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-wider mb-1">
                    Cash on Delivery
                  </div>
                  <div className="text-[11px] text-content/40 uppercase tracking-widest">
                    Pay when you receive the items
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order Items Section - SPREAD OUT AS REQUESTED */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-content text-surface flex items-center justify-center shadow-lg shadow-content/10">
                <Package size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Review Items
              </h2>
            </div>

            <div className="space-y-4">
              {selectedItems.map((item) => (
                <motion.div
                  key={item.sku_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-[2rem] bg-surface/30 backdrop-blur-sm border border-content/5 flex items-center gap-6 group hover:bg-surface/50 transition-all"
                >
                  <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-content/[0.02] border border-content/5 flex-shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-content/10">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1 mb-1">
                      {item.name}
                    </h4>
                    <div className="text-[10px] uppercase tracking-widest text-content/30 italic font-light mb-4">
                      {item.attributes || "Standard Edition"}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-content/[0.03] rounded-full">
                        Qty: {item.quantity}
                      </div>
                      <div className="text-lg font-black text-content tracking-tighter">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary (Simplified) */}
        <div className="lg:col-span-4 sticky top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-content text-surface shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10 opacity-40">
                <ShoppingBag size={16} />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black">
                  Final Summary
                </span>
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-[11px] uppercase tracking-widest opacity-40">
                  <span>Subtotal</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest opacity-40">
                  <span>Shipping Fee</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest opacity-40">
                  <span>Tax (Included)</span>
                  <span>$0.00</span>
                </div>

                <div className="h-px bg-surface/10 my-8" />

                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-1">
                      Grand Total
                    </span>
                    <span className="text-3xl font-black tracking-tighter">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={placingOrder || loading || selectedItems.length === 0}
                className={cn(
                  "w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] transition-all relative overflow-hidden",
                  placingOrder || loading || selectedItems.length === 0
                    ? "bg-surface/10 text-surface/30 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-surface hover:text-content shadow-2xl shadow-primary/40",
                )}
              >
                {placingOrder ? "Processing Selection..." : "Complete Purchase"}
              </motion.button>

              <div className="mt-8 text-center opacity-20 text-[8px] uppercase tracking-[0.3em] font-bold">
                Antigravity Encryption Active
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
