import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useLanguage } from "../i18n/LanguageProvider";
import { LANGUAGES, type Language } from "../i18n/translations";
import "./Layout.css";

const LANGUAGE_LABELS: Record<Language, string> = {
  "en-US": "EN",
  "pt-BR": "PT",
};

function Layout() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-pill">
          <Link to="/" className="header-title">
            <span className="header-title-mark">◐</span>
            L·Compendium
          </Link>
          <nav className="header-nav">
            <NavLink to="/" end className="nav-link">
              {t("header.browse")}
            </NavLink>
            <a className="nav-link" href="#about">
              {t("header.about")}
            </a>
            <a className="nav-link" href="#journal">
              {t("header.journal")}
            </a>
          </nav>
          <div
            className="header-lang"
            role="group"
            aria-label={t("header.languageLabel")}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`header-lang-btn${
                  lang === language ? " header-lang-btn--active" : ""
                }`}
                onClick={() => setLanguage(lang)}
                aria-pressed={lang === language}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
          {user ? (
            <div className="header-auth">
              {user.is_approved && (
                <Link to="/upload" className="header-cta">
                  {t("header.upload")} <span aria-hidden>→</span>
                </Link>
              )}
              <button
                type="button"
                className="header-logout"
                onClick={logout}
              >
                {t("auth.logout")}
              </button>
            </div>
          ) : (
            <Link to="/login" className="header-cta">
              {t("auth.login")}
            </Link>
          )}
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} L·Compendium</span>
          <span className="footer-tag">{t("footer.tag")}</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
