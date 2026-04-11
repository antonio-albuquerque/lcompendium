import { useLanguage } from "../i18n/LanguageProvider";
import "./Spinner.css";

interface SpinnerProps {
  label?: string;
}

function Spinner({ label }: SpinnerProps) {
  const { t } = useLanguage();
  return (
    <div className="spinner">
      <div className="spinner-ring" />
      <span className="spinner-label">{label ?? t("common.loading")}</span>
    </div>
  );
}

export default Spinner;
