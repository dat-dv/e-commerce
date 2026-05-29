"use client";

import Button from "@/components/atoms/button";
import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { XIcon } from "@/components/atoms/icons";
import Input from "@/components/atoms/input";
import { useMapPicker } from "@/hooks/addresses/use-map-picker";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const MapComponent = dynamic(
  () => import("@/components/molecules/form/form-map-picker/map-component"),
  { ssr: false },
);

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPick: (address: string, coord?: { lat: number; lng: number }) => void;
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onPick,
}: MapPickerModalProps) {
  const t = useTranslations("Common.mapPickerModal");
  const {
    address,
    loading,
    searchQuery,
    suggestions,
    mapCenter,
    mapCoords,
    setSearchQuery,
    setLoading,
    fetchSuggestions,
    selectSuggestion,
    updateLocation,
  } = useMapPicker();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2 && searchQuery !== address) {
        fetchSuggestions(searchQuery);
      } else {
        // We don't clear suggestions here if we want them to stay while typing
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, address, fetchSuggestions]);

  const handleConfirmAddress = () => {
    onPick(address, mapCoords);
    onClose();
  };

  return (
    <AppDialog isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <AppDialogPanel className="bg-surface border-content/10 relative w-full max-w-2xl rounded-3xl border p-8 shadow-2xl">
        <AppDialogTitle className="mb-4 text-2xl font-bold">
          {t("title")}
        </AppDialogTitle>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-6 right-6"
          aria-label={t("close")}
        >
          <XIcon />
        </Button>

        {/* Search Autocomplete */}

        <div className="border-content/10 mb-4 h-[400px] w-full overflow-hidden rounded-2xl border">
          <MapComponent
            onPick={updateLocation}
            setLoading={setLoading}
            center={mapCenter}
          />
        </div>

        <div className="bg-content/5 border-content/10 space-y-6 rounded-2xl border p-6">
          <div>
            <div className="relative mb-4">
              <Input
                aria-label={t("searchLabel")}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                label={t("searchLabel")}
                variant="outline"
                size="md"
                className="bg-surface border-content/10 hover:border-content/20 focus:ring-primary/50 w-full"
              />
              {suggestions.length > 0 && (
                <div className="bg-surface/90 border-content/10 absolute z-[1100] mt-2 max-h-60 w-full overflow-y-auto rounded-xl border shadow-2xl backdrop-blur-md">
                  {suggestions.map((item) => (
                    <div
                      key={item.place_id}
                      className="hover:bg-primary/5 border-content/5 cursor-pointer border-b px-4 py-3 text-sm transition-colors last:border-b-0"
                      onClick={() => selectSuggestion(item)}
                    >
                      {item.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmAddress}
              disabled={!address || loading}
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
}
