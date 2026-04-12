import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useLanguage } from "../i18n/LanguageProvider";
import "./AuthPage.css";

function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setPending(true);
      try {
        await login({ username, password });
        navigate("/");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : t("common.unknownError");
        setError(t("auth.loginError", { message: msg }));
      } finally {
        setPending(false);
      }
    },
    [username, password, login, navigate, t],
  );

  return (
    <div className="auth-page">
      <span className="auth-eyebrow">{t("auth.login")}</span>
      <h1 className="auth-heading">{t("auth.login")}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          <span>{t("auth.username")}</span>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="auth-label">
          <span>{t("auth.password")}</span>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          className="btn-primary auth-submit"
          disabled={pending}
        >
          {t("auth.loginSubmit")}
        </button>

        <p className="auth-switch">
          {t("auth.noAccount")}{" "}
          <Link to="/register">{t("auth.register")}</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
