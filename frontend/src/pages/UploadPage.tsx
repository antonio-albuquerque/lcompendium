import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEntry } from "../api/entries";
import PhotoUploader from "../components/PhotoUploader";
import LocationPicker from "../components/LocationPicker";
import "./UploadPage.css";

function UploadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) {
        return Promise.reject(new Error("No file selected"));
      }
      return createEntry(file, location?.latitude, location?.longitude);
    },
    onSuccess: (entry) => {
      void queryClient.invalidateQueries({ queryKey: ["entries"] });
      navigate(`/entries/${entry.id}`);
    },
  });

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
  }, []);

  const handleLocationChange = useCallback(
    (coords: { latitude: number; longitude: number } | null) => {
      setLocation(coords);
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) return;
      mutation.mutate();
    },
    [file, mutation],
  );

  return (
    <div className="upload-page">
      <h1 className="upload-heading">Upload a Photo</h1>
      <p className="upload-subheading">
        Take or upload a photo and we will identify the species for you.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <section className="upload-section">
          <h2 className="upload-section-title">Photo</h2>
          <PhotoUploader onChange={handleFileChange} />
        </section>

        <section className="upload-section">
          <h2 className="upload-section-title">Location (optional)</h2>
          <p className="upload-section-hint">
            Adding your location helps with species identification.
          </p>
          <LocationPicker onChange={handleLocationChange} />
        </section>

        {mutation.isError && (
          <div className="upload-error">
            <p>
              Upload failed:{" "}
              {mutation.error instanceof Error
                ? mutation.error.message
                : "An unknown error occurred."}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary upload-submit"
          disabled={!file || mutation.isPending}
        >
          {mutation.isPending ? "Identifying species..." : "Upload & Identify"}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
