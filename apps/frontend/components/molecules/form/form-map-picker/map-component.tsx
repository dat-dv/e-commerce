"use client";

import Button from "@/components/atoms/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })
    ._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface MapComponentProps {
  onPick: (address: string, lat?: number, lng?: number) => void;
  setLoading: (loading: boolean) => void;
  center?: [number, number];
}

interface LocationMarkerProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  fetchAddress: (lat: number, lng: number) => void;
}

function LocationMarker({
  position,
  setPosition,
  fetchAddress,
}: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapComponent({
  onPick,
  setLoading,
  center,
}: MapComponentProps) {
  const t = useTranslations("Common.mapPickerModal");
  const [position, setPosition] = useState<[number, number]>([
    10.762622, 106.660172,
  ]); // Default to HCM City

  const [prevCenter, setPrevCenter] = useState(center);

  useEffect(() => {
    if (
      center &&
      (!prevCenter ||
        center[0] !== prevCenter[0] ||
        center[1] !== prevCenter[1])
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrevCenter(center);
      setPosition(center);
    }
  }, [center, prevCenter, setPrevCenter]);

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        );
        const data = await res.json();
        onPick(data.display_name || t("unknownAddress"), lat, lng);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [onPick, setLoading, t],
  );

  const getCurrentLocation = useCallback(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          fetchAddress(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, [fetchAddress]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={position} />
      <LocationMarker
        position={position}
        setPosition={setPosition}
        fetchAddress={fetchAddress}
      />

      {/* Nút My Location */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={getCurrentLocation}
          className="bg-primary hover:bg-primary-focus text-white shadow-lg"
        >
          My Location
        </Button>
      </div>
    </MapContainer>
  );
}
