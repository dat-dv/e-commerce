"use client";

import {
  AriaDialog,
  AriaDialogPanel,
  AriaDialogTitle,
} from "@/components/atoms/aria/dialog";
import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useMapPicker } from "@/hooks/addresses/use-map-picker";

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
    <AriaDialog
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      className="relative z-[100]"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <AriaDialogPanel
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-surface border border-content/10 shadow-2xl rounded-3xl p-8 relative"
        >
          <AriaDialogTitle className="text-2xl font-bold mb-4">
            Pick Address on Map
          </AriaDialogTitle>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-6 top-6"
            aria-label="Close"
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
                Search & Pick Location:
              </p>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address..."
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
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmAddress}
                disabled={!address || loading}
              >
                Confirm Address
              </Button>
            </div>
          </div>
        </AriaDialogPanel>
      </div>
    </AriaDialog>
  );
}
