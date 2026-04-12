import { Link } from "react-router-dom";
import type { Entry } from "../types/entry";
import { useLanguage } from "../i18n/LanguageProvider";
import { useLocalized } from "../i18n/useLocalized";
import type { Language } from "../i18n/translations";
import "./EntryCard.css";

interface EntryCardProps {
  entry: Entry;
}

function formatDate(dateString: string, language: Language): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function EntryCard({ entry }: EntryCardProps) {
  const { language } = useLanguage();
  const l = useLocalized();
  return (
    <Link to={`/entries/${entry.id}`} className="entry-card">
      <div className="entry-card-image-wrapper">
        <img
          src={entry.photo_url}
          alt={l(entry, "species_name")}
          className="entry-card-image"
          loading="lazy"
        />
        <span className="entry-card-chip">
          <time dateTime={entry.created_at}>
            {formatDate(entry.created_at, language)}
          </time>
        </span>
      </div>
      <div className="entry-card-body">
        <h3 className="entry-card-title">{l(entry, "species_name")}</h3>
        <span className="entry-card-arrow" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}

export default EntryCard;
