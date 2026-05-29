"use client";

import MapPickerModal from "@/components/molecules/form/form-map-picker/map-picker-modal";
import { MapPickerField } from "@ecommerce/ui";
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
    <>
      <MapPickerField
        label={label}
        displayValue={displayValue}
        disabled={disabled}
        error={String(error?.message || "")}
        onOpen={() => setMapOpen(true)}
        labels={{
          placeholder: t("placeholder"),
          change: t("change"),
          select: t("select"),
        }}
      />

      <MapPickerModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onPick={handlePickAddress}
      />
    </>
  );
};
