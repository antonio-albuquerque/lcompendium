import { Link } from "react-router-dom";
import type { Entry } from "../types/entry";
import "./EntryCard.css";

interface EntryCardProps {
  entry: Entry;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link to={`/entries/${entry.id}`} className="entry-card">
      <div className="entry-card-image-wrapper">
        <img
          src={entry.photo_url}
          alt={entry.species_name}
          className="entry-card-image"
          loading="lazy"
        />
      </div>
      <div className="entry-card-body">
        <h3 className="entry-card-title">{entry.species_name}</h3>
        <time className="entry-card-date" dateTime={entry.created_at}>
          {formatDate(entry.created_at)}
        </time>
      </div>
    </Link>
  );
}

export default EntryCard;
