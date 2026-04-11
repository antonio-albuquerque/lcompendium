import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchEntries } from "../api/entries";
import EntryCard from "../components/EntryCard";
import Spinner from "../components/Spinner";
import { useLanguage } from "../i18n/LanguageProvider";
import "./CompendiumPage.css";

const PER_PAGE = 12;

function CompendiumPage() {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["entries", page],
    queryFn: () => fetchEntries(page, PER_PAGE),
  });

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 0;
  const heroImage = data?.entries[0]?.photo_url;
  const totalEntries = data?.total ?? 0;

  return (
    <div className="compendium-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            {t("hero.eyebrow")}
          </span>
          <h1 className="hero-title">
            {t("hero.titlePart1")} <em>{t("hero.titleEm")}</em>
            <br />
            {t("hero.titlePart2")}
          </h1>
          <p className="hero-subtitle">{t("hero.subtitle")}</p>
          <div className="hero-actions">
            <Link to="/upload" className="btn-primary hero-cta">
              {t("hero.cta")} <span aria-hidden>→</span>
            </Link>
            <a href="#browse" className="hero-link">
              {t("hero.exploreLink")}
            </a>
          </div>
          <dl className="hero-stats">
            <div className="hero-stat">
              <dt>{totalEntries.toLocaleString(language)}</dt>
              <dd>{t("hero.statSpecies")}</dd>
            </div>
            <div className="hero-stat">
              <dt>120+</dt>
              <dd>{t("hero.statHabitats")}</dd>
            </div>
            <div className="hero-stat">
              <dt>24/7</dt>
              <dd>{t("hero.statFieldReady")}</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-blob">
            {heroImage ? (
              <img src={heroImage} alt="" className="hero-image" />
            ) : (
              <div className="hero-placeholder">
                <span>🕊️</span>
              </div>
            )}
          </div>
          <div className="hero-leaf hero-leaf-1" />
          <div className="hero-leaf hero-leaf-2" />
        </div>
      </section>

      <section className="field-section" id="browse">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">{t("field.eyebrow")}</span>
            <h2 className="section-title">{t("field.title")}</h2>
          </div>
          <p className="section-description">{t("field.description")}</p>
        </div>

        {isLoading && <Spinner label={t("compendium.loading")} />}

        {isError && (
          <div className="compendium-status compendium-error">
            <p>
              {t("compendium.loadError", {
                message: (error as Error).message,
              })}
            </p>
          </div>
        )}

        {data && data.entries.length === 0 && (
          <div className="compendium-empty">
            <div className="compendium-empty-icon">🌿</div>
            <p className="compendium-empty-title">{t("compendium.emptyTitle")}</p>
            <p className="compendium-empty-text">{t("compendium.emptyText")}</p>
            <Link to="/upload" className="btn-primary">
              {t("compendium.emptyCta")} <span aria-hidden>→</span>
            </Link>
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
                  {t("compendium.previous")}
                </button>
                <span className="pagination-info">
                  {t("compendium.pageInfo", { page, total: totalPages })}
                </span>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page >= totalPages}
                >
                  {t("compendium.next")}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default CompendiumPage;
