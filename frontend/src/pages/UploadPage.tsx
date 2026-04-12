import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEntry } from "../api/entries";
import PhotoUploader from "../components/PhotoUploader";
import LocationPicker from "../components/LocationPicker";
import Spinner from "../components/Spinner";
import { useAuth } from "../auth/AuthProvider";
import { useLanguage } from "../i18n/LanguageProvider";
import "./UploadPage.css";

function UploadPage() {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) return <Spinner />;

  if (!user.is_approved) {
    return (
      <div className="upload-page">
        <span className="upload-eyebrow">{t("auth.pendingApprovalTitle")}</span>
        <p className="upload-subheading">{t("auth.pendingApproval")}</p>
      </div>
    );
  }
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
      <span className="upload-eyebrow">{t("upload.eyebrow")}</span>
      <h1 className="upload-heading">
        {t("upload.headingPart1")} <em>{t("upload.headingEm")}</em>{" "}
        {t("upload.headingPart2")}
      </h1>
      <p className="upload-subheading">{t("upload.subheading")}</p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <section className="upload-section">
          <h2 className="upload-section-title">{t("upload.photoSection")}</h2>
          <PhotoUploader onChange={handleFileChange} />
        </section>

        <section className="upload-section">
          <h2 className="upload-section-title">
            {t("upload.locationSection")}
          </h2>
          <p className="upload-section-hint">{t("upload.locationHint")}</p>
          <LocationPicker onChange={handleLocationChange} />
        </section>

        {mutation.isError && (
          <div className="upload-error">
            <p>
              {t("upload.errorLabel", {
                message:
                  mutation.error instanceof Error
                    ? mutation.error.message
                    : t("common.unknownError"),
              })}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary upload-submit"
          disabled={!file || mutation.isPending}
        >
          {mutation.isPending
            ? t("upload.identifying")
            : t("upload.submit")}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
