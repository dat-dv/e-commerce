"use client";

import React, { useState } from "react";
import { Plus, MapPin, Trash2, Star } from "lucide-react";
import { useAddresses } from "@/hooks/profile/use-addresses";
import { TCreateAddressInput } from "@/domain/addresses/types/address.model";
import Button from "@/components/atoms/button";
import { AddressesForm } from "@/components/molecules/addresses-form";
import { AddressFormData } from "@/components/molecules/addresses-form/addresses.schema";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export const AddressesView = () => {
  const {
    addresses,
    loading,
    adding,
    mutatingId,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  const handleAddAddress = async (data: AddressFormData): Promise<boolean> => {
    const payload: TCreateAddressInput = {
      label: data.label,
      receiverName: data.receiverName,
      receiverPhone: data.receiverPhone,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      latitude: data.latitude,
      longitude: data.longitude,
      isDefault: data.isDefault,
    };

    const success = await addAddress(payload);
    if (success) setShowForm(false);
    return success;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-content tracking-tight">
            My Addresses
          </h1>
          <p className="text-sm text-content/50 mt-1">
            Manage your shipping destinations.
          </p>
        </div>
        <Button
          className="flex items-center gap-2 rounded-xl"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          Add Address
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 border border-primary/20 rounded-2xl bg-surface/60 backdrop-blur-md"
          >
            <h2 className="text-base font-bold text-content mb-4">
              New Address
            </h2>
            <AddressesForm onSubmit={handleAddAddress} loading={adding} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="py-16 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && addresses.length === 0 && (
        <div className="py-16 border-2 border-dashed border-content/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 bg-content/5 rounded-full flex items-center justify-center">
            <MapPin size={24} className="text-content/30" />
          </div>
          <div>
            <p className="font-bold text-content">No addresses yet</p>
            <p className="text-sm text-content/50 mt-1">
              Add a shipping address to get started.
            </p>
          </div>
        </div>
      )}

      {/* Address List */}
      {!loading && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              layout
              className={cn(
                "p-5 rounded-2xl border transition-all",
                addr.isDefault
                  ? "border-primary/30 bg-primary/5"
                  : "border-content/[0.07] bg-surface/40 backdrop-blur-sm",
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-content text-sm">
                      {addr.name}
                    </span>
                    <span className="text-content/30">·</span>
                    <span className="text-sm text-content/60">
                      {addr.phone}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                        Default
                      </span>
                    )}
                    <span className="text-[10px] bg-content/10 text-content/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {addr.label}
                    </span>
                  </div>
                  <p className="text-sm text-content/70 leading-relaxed">
                    {addr.street}, {addr.district}, {addr.province}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      disabled={!!mutatingId}
                      title="Set as default"
                      className="p-2 text-content/40 hover:text-primary transition-colors rounded-lg hover:bg-primary/5 disabled:opacity-40"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    disabled={!!mutatingId}
                    className="p-2 text-content/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5 disabled:opacity-40"
                  >
                    {mutatingId === addr.id ? (
                      <div className="w-4 h-4 border-2 border-content/30 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
