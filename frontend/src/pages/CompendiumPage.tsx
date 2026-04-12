import { useState } from "react";
import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchEntries } from "../api/entries";
import EntryCard from "../components/EntryCard";
import Spinner from "../components/Spinner";
import { useLanguage } from "../i18n/LanguageProvider";
import { useLocalized } from "../i18n/useLocalized";
import heroParrot from "../assets/couleur-parrot-3417217_1920.jpg";
import "./CompendiumPage.css";

const PER_PAGE = 12;

function CompendiumPage() {
  const { t, language } = useLanguage();
  const l = useLocalized();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["entries", page],
    queryFn: () => fetchEntries(page, PER_PAGE),
  });

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 0;
  const totalEntries = data?.total ?? 0;

  return (
    <div className="compendium-page">
      <section
        className="hero"
        style={{ "--hero-bg": `url(${heroParrot})` } as CSSProperties}
      >
        <div className="hero-backdrop" aria-hidden />

        <div className="hero-top">
          <div className="hero-pill">
            <span className="hero-pill-icon" aria-hidden>
              ◐
            </span>
            <div className="hero-pill-text">
              <span className="hero-pill-value">
                {totalEntries.toLocaleString(language)}+
              </span>
              <span className="hero-pill-label">
                {t("hero.statSpecies")}
              </span>
            </div>
          </div>
          <p className="hero-intro">{t("hero.subtitle")}</p>
        </div>

        <h1 className="hero-title">
          {t("hero.titlePart1")} <em>{t("hero.titleEm")}</em>
        </h1>

        <div className="hero-bottom">
          <div className="hero-unlock">
            <span className="hero-unlock-kicker">
              {t("hero.unlockKicker")}
            </span>
            <Link to="/upload" className="hero-sun-btn">
              {t("hero.cta")} <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="hero-featured">
            <div className="hero-featured-col">
              <span className="hero-featured-label">
                {t("hero.featuredLabel")}
              </span>
              <span className="hero-featured-name">
                {data?.entries[0]
                  ? l(data.entries[0], "species_name")
                  : t("hero.featuredNone")}
              </span>
            </div>
            <a href="#browse" className="hero-featured-link">
              {t("hero.exploreLink")} <span aria-hidden>→</span>
            </a>
          </div>
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
