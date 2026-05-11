"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";
import MapPickerModal from "@/components/molecules/profile-form/map-picker-modal";
import { AnimatePresence, motion } from "framer-motion";

interface FormMapPickerProps {
  label: string;
  nameLat: string;
  nameLng: string;
  disabled?: boolean;
}

export const FormMapPicker = ({
  label,
  nameLat,
  nameLng,
  disabled,
}: FormMapPickerProps) => {
  const [mapOpen, setMapOpen] = useState(false);
  const [mapAddressStr, setMapAddressStr] = useState("");
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors[nameLat] || errors[nameLng];

  const handlePickAddress = (
    address: string,
    coord?: { lat: number; lng: number },
  ) => {
    setMapAddressStr(address);
    const finalCoord = coord || { lat: 1, lng: 1 };
    setValue(nameLat, finalCoord.lat, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(nameLng, finalCoord.lng, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-content">{label}</label>
      <div
        onClick={() => !disabled && setMapOpen(true)}
        className={cn(
          "p-3 border rounded-xl cursor-pointer flex justify-between items-center",
          mapAddressStr
            ? "border-primary/20 bg-primary/5"
            : "border-content/10 bg-white",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex items-center gap-2 max-w-[80%]">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span
            className={cn(
              "text-sm truncate",
              !mapAddressStr && "text-content/40",
            )}
          >
            {mapAddressStr || "Click to pick address on map"}
          </span>
        </div>
        <span className="text-xs text-primary font-medium">
          {mapAddressStr ? "Change" : "Select"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.span
            role="alert"
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className="text-[11px] font-bold text-red-500 tracking-tight ml-1 overflow-hidden block mt-1"
          >
            {String(error?.message || "")}
          </motion.span>
        )}
      </AnimatePresence>

      <MapPickerModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onPick={handlePickAddress}
      />
    </div>
  );
};
