import { useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEntry, deleteEntry } from "../api/entries";
import Spinner from "../components/Spinner";
import { useLanguage } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/translations";
import "./EntryDetailPage.css";

function formatDate(dateString: string, language: Language): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EntryDetailPage() {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: entry,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => fetchEntry(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteEntry(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["entries"] });
      navigate("/");
    },
  });

  const handleDelete = useCallback(() => {
    const confirmed = window.confirm(t("detail.deleteConfirm"));
    if (confirmed) {
      deleteMutation.mutate();
    }
  }, [deleteMutation, t]);

  if (isLoading) {
    return (
      <div className="detail-page">
        <Spinner label={t("detail.loading")} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="detail-page">
        <div className="detail-status detail-error">
          {t("detail.loadError", { message: (error as Error).message })}
        </div>
        <Link to="/" className="detail-back">
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="detail-page">
        <div className="detail-status">{t("detail.notFound")}</div>
        <Link to="/" className="detail-back">
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/" className="detail-back">
        {t("detail.back")}
      </Link>

      <div className="detail-content">
        <div className="detail-photo-wrapper">
          <img
            src={entry.photo_url}
            alt={entry.species_name}
            className="detail-photo"
          />
        </div>

        <div className="detail-info">
          <span className="detail-eyebrow">{t("detail.eyebrow")}</span>
          <h1 className="detail-species">{entry.species_name}</h1>

          <p className="detail-description">{entry.description}</p>

          <div className="detail-meta">
            {entry.latitude !== null && entry.longitude !== null && (
              <div className="detail-meta-item">
                <span className="detail-meta-label">
                  {t("detail.locationLabel")}
                </span>
                <span className="detail-meta-value">
                  {entry.latitude.toFixed(5)}, {entry.longitude.toFixed(5)}
                </span>
              </div>
            )}

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                {t("detail.catalogedLabel")}
              </span>
              <time className="detail-meta-value" dateTime={entry.created_at}>
                {formatDate(entry.created_at, language)}
              </time>
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? t("detail.deleting")
                : t("detail.delete")}
            </button>
          </div>

          {deleteMutation.isError && (
            <div className="detail-delete-error">
              {t("detail.deleteError", {
                message:
                  deleteMutation.error instanceof Error
                    ? deleteMutation.error.message
                    : t("common.unknownError"),
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EntryDetailPage;
