import React from "react";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { IAddress } from "@/domain/addresses/types/address.model";

interface ShippingSectionProps {
  addresses: IAddress[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  loading: boolean;
  onAddAddress: () => void;
}

export const ShippingSection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  loading,
  onAddAddress,
}: ShippingSectionProps) => {
  return (
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
                <span>{address.isDefault ? "Default Address" : "Address"}</span>
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
          <div className="col-span-2 p-12 rounded-3xl border border-dashed border-content/10 flex flex-col items-center justify-center text-center bg-surface/20">
            <div className="text-content/30 mb-4 font-light italic">
              No addresses found
            </div>
            <button
              onClick={onAddAddress}
              className="px-8 py-3 bg-content text-surface text-[11px] uppercase tracking-widest font-black rounded-full hover:bg-primary transition-all"
            >
              Add New Address
            </button>
          </div>
        )}

        {addresses.length > 0 && (
          <button
            onClick={onAddAddress}
            className="p-6 rounded-2xl border border-dashed border-content/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group text-content/40 hover:text-primary"
          >
            <Plus
              size={24}
              className="opacity-40 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-[10px] uppercase tracking-widest font-black">
              Add New Address
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
