"use client";

import { useEffect, useState } from "react";
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
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const lat = watch(nameLat);
  const lng = watch(nameLng);
  const hasCoord =
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat !== 0 &&
    lng !== 0;

  const [pickedAddress, setPickedAddress] = useState("");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (hasCoord && !pickedAddress && !resolving) {
      const resolveAddress = async () => {
        setResolving(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const data = await res.json();
          if (data.display_name) {
            setPickedAddress(data.display_name);
          }
        } catch (error) {
          console.error("Failed to resolve address:", error);
        } finally {
          setResolving(false);
        }
      };
      resolveAddress();
    }
  }, [hasCoord, lat, lng, pickedAddress, resolving]);

  const displayValue = resolving
    ? "Resolving location..."
    : pickedAddress || (hasCoord ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "");

  const error = errors[nameLat] || errors[nameLng];

  const handlePickAddress = (
    address: string,
    coord?: { lat: number; lng: number },
  ) => {
    setPickedAddress(address);
    const finalCoord = coord || { lat: 0, lng: 0 };
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
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
        {label}
      </label>
      <div
        onClick={() => !disabled && setMapOpen(true)}
        className={cn(
          "p-3 border rounded-xl cursor-pointer flex justify-between items-center",
          displayValue
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
              !displayValue && "text-content/40",
            )}
          >
            {displayValue || "Click to pick address on map"}
          </span>
        </div>
        <span className="text-xs text-primary font-medium">
          {displayValue ? "Change" : "Select"}
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
