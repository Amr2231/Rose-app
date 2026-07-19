"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, MapPinHouse } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

// Types
interface AddressFormStep2Props {
  mapPosition: { lat: number; lng: number };
  loading: boolean;
  isRTL: boolean;
  onBack: () => void;
  onSave: () => void;
  onLocationUpdate: (lat: number, lng: number) => void;
  translations: {
    selectLocation: string;
    findLocation: string;
    notSupported: string;
    locationError: string;
    saving: string;
    saveBtn: string;
    addBtn: string;
  };
  editing: boolean;
}

// Component
export function AddressFormStep2({
  mapPosition,
  loading,
  isRTL,
  onBack,
  onSave,
  onLocationUpdate,
  translations: t,
  editing,
}: AddressFormStep2Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [locating, setLocating] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  // Handle map click
  const handleMapClick = useCallback(
    (e: any) => {
      if (!e.detail?.latLng) return;
      onLocationUpdate(e.detail.latLng.lat, e.detail.latLng.lng);
    },
    [onLocationUpdate]
  );

  // Handle marker drag
  const handleDragEnd = (e: any) => {
    setIsDragging(false);
    if (!e.latLng) return;
    onLocationUpdate(e.latLng.lat(), e.latLng.lng());
  };

  // Find my location
  const handleFindMyLocation = () => {
    if (!navigator.geolocation) return alert(t.notSupported);

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onLocationUpdate(coords.latitude, coords.longitude);
        setLocating(false);
      },
      () => {
        alert(t.locationError);
        setLocating(false);
      }
    );
  };

  // Ensure plain objects for Google Maps
  const center = { lat: mapPosition.lat, lng: mapPosition.lng };

  // Render
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Back button & title */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="default"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-maroon-600 text-white flex items-center justify-center p-0"
        >
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Button>
        <p className="text-2xl font-medium text-maroon-600">
          {t.selectLocation}
        </p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[21.875rem] rounded-lg overflow-hidden border bg-gray-100">
        <APIProvider apiKey={apiKey}>
          <Map
            center={center}
            zoom={15}
            mapId="be560d0baba3386b2fdaa6a5"
            gestureHandling="greedy"
            onClick={handleMapClick}
            style={{ width: "100%", height: "100%" }}
            zoomControl
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
          >
            <AdvancedMarker
              position={center}
              draggable
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
            >
              <div
                className={`transition-transform ${isDragging ? "scale-125" : "scale-100"}`}
              >
                <Pin
                  background="#dc2626"
                  glyphColor="#fff"
                  borderColor="#991b1b"
                  scale={1.3}
                />
              </div>
            </AdvancedMarker>
          </Map>
        </APIProvider>

        {/* Find My Location Button */}
        <div className="absolute top-3 end-3 z-10">
          <Button
            variant="default"
            size="sm"
            onClick={handleFindMyLocation}
            disabled={locating}
            className="bg-white hover:bg-gray-50 rounded-xl border border-maroon-600 text-maroon-600 h-9 px-3"
          >
            {locating ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <MapPinHouse size={16} />
                <span className="ms-2">{t.findLocation}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <Button
        variant="default"
        onClick={onSave}
        disabled={loading}
        className="w-full h-12 mt-12 bg-maroon-600 text-white rounded-xl font-medium"
      >
        {loading ? t.saving : editing ? t.saveBtn : t.addBtn}
      </Button>
    </div>
  );
}
