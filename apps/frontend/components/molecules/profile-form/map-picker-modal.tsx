"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";
import { useMapPicker } from "@/hooks/addresses/use-map-picker";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const MapComponent = dynamic(
  () => import("@/components/molecules/profile-form/map-component"),
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
      <AppDialogPanel className="w-full max-w-2xl bg-surface border border-content/10 shadow-2xl rounded-3xl p-8 relative">
        <AppDialogTitle className="text-2xl font-bold mb-4">
          {t("title")}
        </AppDialogTitle>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-6 top-6"
          aria-label={t("close")}
        >
          <XIcon />
        </Button>

        {/* Search Autocomplete */}

        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-content/10 mb-4">
          <MapComponent
            onPick={updateLocation}
            setLoading={setLoading}
            center={mapCenter}
          />
        </div>

        <div className="space-y-6 bg-content/5 p-6 rounded-2xl border border-content/10">
          <div>
            <p className="text-sm font-medium opacity-60 mb-2">
              {t("searchLabel")}
            </p>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full px-4 py-3 bg-surface border border-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm hover:border-content/20"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-[1100] w-full bg-surface/90 backdrop-blur-md border border-content/10 rounded-xl shadow-2xl mt-2 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.place_id}
                      className="px-4 py-3 hover:bg-primary/5 cursor-pointer text-sm border-b border-content/5 last:border-b-0 transition-colors"
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
