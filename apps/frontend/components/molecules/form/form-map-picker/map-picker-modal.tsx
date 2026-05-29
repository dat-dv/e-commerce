"use client";

import { MapPickerDialog, MapPickerSuggestion } from "@ecommerce/ui";

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

  const handleSuggestionSelect = (suggestion: MapPickerSuggestion) => {
    const source = suggestions.find((item) => item.place_id === suggestion.id);
    if (source) {
      selectSuggestion(source);
    }
  };

  return (
    <MapPickerDialog
      isOpen={isOpen}
      loading={loading}
      canConfirm={!!address}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSuggestionSelect={handleSuggestionSelect}
      onClose={onClose}
      onConfirm={handleConfirmAddress}
      labels={{
        title: t("title"),
        close: t("close"),
        searchLabel: t("searchLabel"),
        searchPlaceholder: t("searchPlaceholder"),
        cancel: t("cancel"),
        confirm: t("confirm"),
      }}
      suggestions={suggestions.map((item) => ({
        id: item.place_id,
        label: item.display_name,
      }))}
      mapContent={
        <>
          <MapComponent
            onPick={updateLocation}
            setLoading={setLoading}
            center={mapCenter}
          />
        </>
      }
    />
  );
}
