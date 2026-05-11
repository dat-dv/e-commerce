"use client";

import React, { useState } from "react";
import { Plus, MapPin, Trash2, X } from "lucide-react";
import { useAddresses } from "@/hooks/profile/use-addresses";
import Button from "@/components/atoms/button";
import { AddressesForm } from "@/components/molecules/addresses-form";
import { AddressFormData } from "@/components/molecules/addresses-form/addresses.schema";

export const AddressesView = () => {
  const {
    addresses,
    deleteAddress,
    setDefaultAddress,
    addAddress,
    adding,
    loading,
  } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  const handleAddAddress = async (data: AddressFormData) => {
    const success = await addAddress(data);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-content">My Addresses</h1>
          <p className="text-sm text-content/60">
            Manage your shipping addresses.
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add New Address"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border border-primary/20 rounded-xl bg-white">
          <h2 className="text-lg font-bold text-content mb-4">
            Add New Address
          </h2>
          <AddressesForm onSubmit={handleAddAddress} loading={adding} />
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="border-2 border-dashed border-content/10 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 bg-content/5 rounded-full flex items-center justify-center text-content/40">
            <MapPin size={24} />
          </div>
          <div>
            <p className="font-semibold text-content">No addresses added yet</p>
            <p className="text-sm text-content/50">
              Add a shipping address to use during checkout.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl border transition-all ${
                addr.isDefault
                  ? "border-primary/20 bg-white"
                  : "border-content/5 bg-white/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-content">
                      {addr.receiverName}
                    </span>
                    <span className="text-sm text-content/50">|</span>
                    <span className="text-sm text-content/60">
                      {addr.receiverPhone}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-content/80">
                    {addr.detailAddress}
                  </p>
                  <span className="text-xs text-content/40 uppercase font-bold tracking-wider">
                    {addr.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      disabled={loading}
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-2 text-content/40 hover:text-red-500 transition-colors"
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
