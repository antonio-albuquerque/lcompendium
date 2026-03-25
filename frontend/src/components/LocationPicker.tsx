import { useState, useCallback } from "react";
import "./LocationPicker.css";

interface LocationPickerProps {
  onChange: (coords: { latitude: number; longitude: number } | null) => void;
}

function LocationPicker({ onChange }: LocationPickerProps) {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
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
            setError("Location access was denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    );
  }, [onChange]);

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
            Location: {coords.latitude.toFixed(5)},{" "}
            {coords.longitude.toFixed(5)}
          </span>
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear location
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-secondary"
          onClick={handleGetLocation}
          disabled={loading}
        >
          {loading ? "Getting location..." : "Use my location"}
        </button>
      )}
      {error && (
        <p className="location-picker-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default LocationPicker;
