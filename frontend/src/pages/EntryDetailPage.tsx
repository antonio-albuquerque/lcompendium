import { useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEntry, deleteEntry } from "../api/entries";
import "./EntryDetailPage.css";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EntryDetailPage() {
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry? This action cannot be undone.",
    );
    if (confirmed) {
      deleteMutation.mutate();
    }
  }, [deleteMutation]);

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="detail-status">Loading entry...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="detail-page">
        <div className="detail-status detail-error">
          Failed to load entry: {(error as Error).message}
        </div>
        <Link to="/" className="detail-back">
          Back to browse
        </Link>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="detail-page">
        <div className="detail-status">Entry not found.</div>
        <Link to="/" className="detail-back">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/" className="detail-back">
        Back to browse
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
          <h1 className="detail-species">{entry.species_name}</h1>

          <p className="detail-description">{entry.description}</p>

          <div className="detail-meta">
            {entry.latitude !== null && entry.longitude !== null && (
              <div className="detail-meta-item">
                <span className="detail-meta-label">Location</span>
                <span className="detail-meta-value">
                  {entry.latitude.toFixed(5)}, {entry.longitude.toFixed(5)}
                </span>
              </div>
            )}

            <div className="detail-meta-item">
              <span className="detail-meta-label">Cataloged</span>
              <time className="detail-meta-value" dateTime={entry.created_at}>
                {formatDate(entry.created_at)}
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
              {deleteMutation.isPending ? "Deleting..." : "Delete Entry"}
            </button>
          </div>

          {deleteMutation.isError && (
            <div className="detail-delete-error">
              Failed to delete:{" "}
              {deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : "Unknown error"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EntryDetailPage;
