import { useState, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageProvider";
import "./LocationPicker.css";

interface LocationPickerProps {
  onChange: (coords: { latitude: number; longitude: number } | null) => void;
}

function LocationPicker({ onChange }: LocationPickerProps) {
  const { t } = useLanguage();
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t("locationPicker.unsupported"));
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoords(newCoords);
        setLoading(false);
        onChange(newCoords);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(t("locationPicker.denied"));
            break;
          case err.POSITION_UNAVAILABLE:
            setError(t("locationPicker.unavailable"));
            break;
          case err.TIMEOUT:
            setError(t("locationPicker.timeout"));
            break;
          default:
            setError(t("locationPicker.unknown"));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    );
  }, [onChange, t]);

  const handleClear = useCallback(() => {
    setCoords(null);
    setError(null);
    onChange(null);
  }, [onChange]);

  return (
    <div className="location-picker">
      {coords ? (
        <div className="location-picker-coords">
          <span className="location-picker-value">
            {t("locationPicker.label", {
              lat: coords.latitude.toFixed(5),
              lon: coords.longitude.toFixed(5),
            })}
          </span>
          <button type="button" className="btn-secondary" onClick={handleClear}>
            {t("locationPicker.clear")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-secondary"
          onClick={handleGetLocation}
          disabled={loading}
        >
          {loading ? t("locationPicker.loading") : t("locationPicker.use")}
        </button>
      )}
      {error && <p className="location-picker-error">{error}</p>}
    </div>
  );
}

export default LocationPicker;
