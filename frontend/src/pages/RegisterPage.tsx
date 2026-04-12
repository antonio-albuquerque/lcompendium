import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useLanguage } from "../i18n/LanguageProvider";
import "./AuthPage.css";

function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (password !== confirmPassword) {
        setError(t("auth.passwordMismatch"));
        return;
      }

      setPending(true);
      try {
        await register({ username, email, password });
        navigate("/");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : t("common.unknownError");
        setError(t("auth.registerError", { message: msg }));
      } finally {
        setPending(false);
      }
    },
    [username, email, password, confirmPassword, register, navigate, t],
  );

  return (
    <div className="auth-page">
      <span className="auth-eyebrow">{t("auth.register")}</span>
      <h1 className="auth-heading">{t("auth.register")}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          <span>{t("auth.username")}</span>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={50}
            autoComplete="username"
          />
        </label>

        <label className="auth-label">
          <span>{t("auth.email")}</span>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
            minLength={8}
            autoComplete="new-password"
          />
        </label>

        <label className="auth-label">
          <span>{t("auth.confirmPassword")}</span>
          <input
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          className="btn-primary auth-submit"
          disabled={pending}
        >
          {t("auth.registerSubmit")}
        </button>

        <p className="auth-switch">
          {t("auth.hasAccount")}{" "}
          <Link to="/login">{t("auth.login")}</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
