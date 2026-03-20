import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEntries } from "../api/entries";
import EntryCard from "../components/EntryCard";
import "./CompendiumPage.css";

const PER_PAGE = 12;

function CompendiumPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["entries", page],
    queryFn: () => fetchEntries(page, PER_PAGE),
  });

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 0;

  return (
    <div className="compendium-page">
      <h1 className="compendium-heading">Browse Species</h1>

      {isLoading && (
        <div className="compendium-status">
          <p>Loading entries...</p>
        </div>
      )}

      {isError && (
        <div className="compendium-status compendium-error">
          <p>Failed to load entries: {(error as Error).message}</p>
        </div>
      )}

      {data && data.entries.length === 0 && (
        <div className="compendium-empty">
          <p className="compendium-empty-title">No entries yet</p>
          <p className="compendium-empty-text">
            Upload a photo to start cataloging species.
          </p>
        </div>
      )}

      {data && data.entries.length > 0 && (
        <>
          <div className="compendium-grid">
            {data.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="compendium-pagination">
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CompendiumPage;
