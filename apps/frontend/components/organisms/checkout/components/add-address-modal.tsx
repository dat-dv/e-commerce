import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AddressesForm } from "@/components/molecules/addresses-form";
import { ICreateAddressInput } from "@/domain/addresses/types/address.model";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateAddressInput) => Promise<boolean>;
  loading: boolean;
}

export const AddAddressModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: AddAddressModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-content/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="px-10 py-8 border-b border-content/5 flex justify-between items-center bg-surface/50 backdrop-blur-xl">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  New Address
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-content/40 mt-1">
                  Shipping Details
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full hover:bg-content/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 max-h-[70vh] overflow-y-auto hide-scrollbar">
              <AddressesForm onSubmit={onSubmit} loading={loading} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
