"use client";

import MapPickerModal from "@/components/molecules/profile-form/map-picker-modal";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

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
  const t = useTranslations("Common.formMapPicker");
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
    ? t("resolving")
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
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-content/80 ml-1 text-sm font-bold tracking-tight opacity-70">
        {label}
      </label>
      <div
        onClick={() => !disabled && setMapOpen(true)}
        className={cn(
          "flex h-10 cursor-pointer items-center justify-between rounded-xl border px-4 transition-all duration-300",
          displayValue
            ? "border-primary/40 bg-primary/5 shadow-primary/5 shadow-sm"
            : "border-content/10 bg-white/5 backdrop-blur-xl",
          disabled && "cursor-not-allowed opacity-50 shadow-none",
        )}
      >
        <div className="flex max-w-[80%] items-center gap-3">
          <MapPin className="text-primary h-4 w-4 flex-shrink-0" />
          <span
            className={cn(
              "truncate text-sm",
              !displayValue && "text-content/40",
            )}
          >
            {displayValue || t("placeholder")}
          </span>
        </div>
        <span className="text-primary text-xs font-medium">
          {displayValue ? t("change") : t("select")}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.span
            role="alert"
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className={`mt-1 ml-1 block overflow-hidden ${TYPOGRAPHY.badge} tracking-tight text-red-500`}
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
