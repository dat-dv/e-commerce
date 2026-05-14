import React from "react";
import { motion } from "framer-motion";
import { Edit, MapPin, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { TAddress } from "@/domain/addresses/types/address.model";
import Button from "@/components/atoms/button";

interface ShippingSectionProps {
  addresses: TAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  loading: boolean;
  onAddAddress: () => void;
  onClickEdit: (address: TAddress) => void;
}

export const ShippingSection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  loading,
  onAddAddress,
  onClickEdit,
}: ShippingSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-content text-surface flex items-center justify-center">
            <MapPin size={16} />
          </div>
          <h2 className="text-xl font-bold text-content capitalize">
            Shipping address
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddAddress}
          className="text-xs font-semibold flex items-center gap-2 hover:text-primary transition-colors capitalize"
        >
          <Plus size={14} />
          New address
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="py-8 text-center text-content/20 italic font-light text-sm capitalize">
            Loading addresses...
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;

            // Build address string cleanly
            const addressParts = [
              address.street,
              address.ward,
              address.district,
              address.province,
            ].filter(Boolean);
            const fullAddress = addressParts.join(", ");

            return (
              <motion.div
                key={address.id}
                whileTap={{ scale: 0.995 }}
                onClick={() => setSelectedAddressId(address.id)}
                className={cn(
                  "px-5 py-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-4",
                  isSelected
                    ? "border-primary bg-primary/[0.03] shadow-sm shadow-primary/5"
                    : "border-content/5 hover:border-content/20 bg-surface/30",
                )}
              >
                {/* Selection Indicator */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-content/20 bg-transparent",
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-surface" />
                  )}
                </div>

                <div className="w-full flex-1 min-w-0 flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-sm text-content capitalize">
                        {address.name || "No Name"}
                      </span>
                      <span className="text-content/40 text-xs font-medium">
                        {address.phone || "No Phone"}
                      </span>
                    </div>
                    <div className="text-content/50 text-sm truncate font-medium flex-1">
                      {fullAddress}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  {address.isDefault && (
                    <span className="shrink-0 text-[8px] font-bold px-2 py-0.5 bg-primary/5 text-primary/60 rounded-md uppercase tracking-tighter border border-primary/10">
                      Default
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickEdit(address);
                    }}
                    className="p-1.5 rounded-lg hover:bg-content/5 text-content/30 hover:text-content transition-colors"
                  >
                    <Edit size={14} className="rotate-45" />
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 rounded-2xl border border-dashed border-content/10 flex flex-col items-center justify-center text-center bg-surface/20">
            <p className="text-content/30 mb-4 text-xs italic font-light">
              No addresses found
            </p>
            <Button
              onClick={onAddAddress}
              size="sm"
              className="text-[10px] uppercase tracking-widest font-black"
            >
              Add New Address
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
