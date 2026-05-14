import { useState, useCallback } from "react";

interface MapCoords {
  lat: number;
  lng: number;
}

interface SearchSuggestion {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

interface INominatimResponse {
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface IPhotonResponse {
  features: Array<{
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
  }>;
}

export const useMapPicker = (initialCenter?: [number, number]) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(
    initialCenter,
  );
  const [mapCoords, setMapCoords] = useState<MapCoords | undefined>(
    initialCenter
      ? { lat: initialCenter[0], lng: initialCenter[1] }
      : undefined,
  );

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data: INominatimResponse = await res.json();
      const newAddress = data.display_name || "Unknown Address";
      setAddress(newAddress);
      setSearchQuery(newAddress);
      setMapCoords({ lat, lng });
      return newAddress;
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return "";
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`,
      );
      const data: IPhotonResponse = await res.json();

      const formatted = data.features.map((feat) => ({
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
      console.error("Failed to fetch suggestions:", error);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter([latitude, longitude]);
          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, [fetchAddress]);

  const selectSuggestion = useCallback((item: SearchSuggestion) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setMapCenter([lat, lng]);
    setMapCoords({ lat, lng });
    setAddress(item.display_name);
    setSearchQuery(item.display_name);
    setSuggestions([]);
  }, []);

  const updateLocation = useCallback(
    (newAddress: string, lat?: number, lng?: number) => {
      setAddress(newAddress);
      setSearchQuery(newAddress);
      if (lat !== undefined && lng !== undefined) {
        setMapCoords({ lat, lng });
      }
    },
    [],
  );

  return {
    address,
    loading,
    searchQuery,
    suggestions,
    mapCenter,
    mapCoords,
    setSearchQuery,
    setLoading,
    fetchAddress,
    fetchSuggestions,
    getCurrentLocation,
    selectSuggestion,
    updateLocation,
  };
};
