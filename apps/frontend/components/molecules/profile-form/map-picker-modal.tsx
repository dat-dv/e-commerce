"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "@/components/atoms/button";
import { XIcon } from "@/components/atoms/icons";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("@/components/molecules/profile-form/map-component"),
  { ssr: false },
);

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPick: (address: string) => void;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onPick,
}: MapPickerModalProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(
    undefined,
  );

  const handlePickAddress = (newAddress: string) => {
    setAddress(newAddress);
    setSearchQuery(newAddress);
    setSuggestions([]);
  };

  const handleSetLoading = (val: boolean) => {
    setLoading(val);
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`,
      );
      const data = await res.json();

      interface PhotonFeature {
        properties: {
          osm_id: number;
          name?: string;
          street?: string;
          city?: string;
          country?: string;
        };
        geometry: {
          coordinates: [number, number];
        };
      }

      // Photon returns GeoJSON, we map it to fit our NominatimResult interface
      const formatted = data.features.map((feat: PhotonFeature) => ({
        place_id: feat.properties.osm_id,
        lat: feat.geometry.coordinates[1].toString(),
        lon: feat.geometry.coordinates[0].toString(),
        display_name: [
          feat.properties.name,
          feat.properties.street,
          feat.properties.city,
          feat.properties.country,
        ]
          .filter(Boolean)
          .join(", "),
      }));

      setSuggestions(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2 && searchQuery !== address) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, address]);

  const handleSelectSuggestion = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setMapCenter([lat, lon]);
    setAddress(item.display_name);
    setSuggestions([]);
    setSearchQuery(item.display_name);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl bg-surface border border-content/10 shadow-2xl rounded-3xl p-8 relative">
          <DialogTitle className="text-2xl font-bold mb-4">
            Pick Address on Map
          </DialogTitle>

          <Button
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
              onPick={handlePickAddress}
              setLoading={handleSetLoading}
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
                        onClick={() => handleSelectSuggestion(item)}
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onPick(address);
                  onClose();
                }}
                disabled={!address || loading}
              >
                Confirm Address
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
